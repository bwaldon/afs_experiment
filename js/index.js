function make_slides(f) {
  var   slides = {};

  slides.i0 = slide({
     name : "i0",
     start: function() {
      exp.startT = Date.now();
     }
  });

  slides.instructions = slide({
    name : "instructions",
    button : function() {
      exp.go(); //use exp.go() if and only if there is no "present" data.
    }
  });

  slides.trial = slide({
    name : "trial",
    present: exp.all_stims,
 
    // PRESENT THE SLIDE
    present_handle: function(stim) {
      this.trial_start = new Date();
      this.stim = stim;
      this.sentence_full = stim.sentence_full;
      this.speaker = stim.speaker;
      this.kind = stim.kind;
      this.id = stim.id;
      this.filename = stim.filename;
      this.list = stim.list;
      // this.not_paid_attention = false;
      exp.sliderPost_accent = -1;
      exp.sliderPost_understand = -1;
      $("#audio_player").data("num-plays", 0);

      $("#error_audio").hide();
      $("#error_percept").hide();
      //$("#attention_check").data("dont-show", false);
      //$("input[type=radio]").attr("checked", null);
      $("textarea").val("");
      $("#audio_src_wav").attr("src", 'audio/'+ this.filename + '.wav');

      $("#firstpart").hide();
      $("#attention_check").data("dont-show", true);
      $("#audio_player").load();
      $("#audio_player").trigger("play");
      this.init_sliders();


    },


   init_sliders : function() {
      utils.make_slider("#accent_slider", function(event, ui) {
        exp.sliderPost_accent = ui.value;
        //$("#number_guess").html(Math.round(ui.value*N));
      });
      utils.make_slider("#understand_slider", function(event, ui) {
        exp.sliderPost_understand = ui.value;
        //$("#number_guess").html(Math.round(ui.value*N));
      });
    },
    

    // CHECK THAT THEY MOVED ALL SLIDERS
    button_percept : function() {
    if (exp.sliderPost_accent != -1 && exp.sliderPost_understand != -1) {
        $("#error_percept").hide();
        this.log_responses();
        _stream.apply(this);
        exp.sliderPost_accent = -1 //use exp.go() if and only if there is no "present" data.
        exp.sliderPost_understand = -1
      } else {
        $("#error_percept").show();
      }

    },

    log_responses : function() {

      exp.data_trials.push({
          "sentence_full" : this.stim.sentence_full,
          "speaker" : this.stim.speaker,
          "id" : this.stim.id,
          "filename" : this.stim.filename,
          "list" : this.stim.list,
          "time": (new Date()) - this.trial_start,
          "slide_number_in_experiment" : exp.phase,
          "response_accent": exp.sliderPost_accent,
          "response_understand": exp.sliderPost_understand,
          "num_plays": $("#audio_player").data("num-plays")
        });
    }

  });



  slides.subj_info =  slide({
    name : "subj_info",
    submit : function(e){
      //if (e.preventDefault) e.preventDefault(); // I don't know what this means.
      exp.subj_data = {
        submittime_utc : Date.now(),
        languages : $('input[name="languages"]:checked').val(),
        english : $('input[name="english"]:checked').val(),
        school : $('input[name="school"]:checked').val(),
        assess : $('input[name="assess"]:checked').val(),
        comments : $("#comments").val(),
      };
      exp.go(); //use exp.go() if and only if there is no "present" data.
    }
  });

  slides.thanks = slide({
    name : "thanks",
    start : function() {
      exp.data= {
          "trials" : exp.data_trials,
          "system" : exp.system,
          "condition" : exp.condition,
          "hit_information" : exp.hit_data,
          "subject_information" : exp.subj_data,
          "time_in_minutes" : (Date.now() - exp.startT)/60000
      };
      setTimeout(function() {turk.submit(exp.data);}, 1000);
    }
  });

  return slides;
}


/// init ///
function init() {
  // var condition = _.sample(["List1","List2"]);
  var condition = _.sample(["List1"]);

  exp.data_trials = [];

   //can randomize between subject conditions here
  var stimlist = _.filter(stimuli, function(stim) {
    return stim.list == condition
  })

  exp.all_stims = stimlist.sort(function(a, b) {
    return parseFloat(a.number) - parseFloat(b.number);
  });

  console.log(exp.all_stims);
 
  exp.system = {
      Browser : BrowserDetect.browser,
      OS : BrowserDetect.OS,
      screenH: screen.height,
      screenUH: exp.height,
      screenW: screen.width,
      screenUW: exp.width
    };
  //blocks of the experiment:
  exp.structure=["i0", "instructions", "trial", "subj_info", "thanks"];

  //make corresponding slides:
  exp.slides = make_slides(exp);

  exp.nQs = utils.get_exp_length(); //this does not work if there are stacks of stims (but does work for an experiment with this structure)
                    //relies on structure and slides being defined

  $('.slide').hide(); //hide everything



  //make sure turkers have accepted HIT (or you're not in mturk)
  $("#start_button").click(function() {
    if (turk.previewMode) {
      $("#mustaccept").show();
    } else {
      $("#start_button").click(function() {$("#mustaccept").show();});
      exp.go();
    }
  });

  $("#audio_player").bind("ended", function () {
        // if (! $("#attention_check").data("dont-show")) {
          // $("#attention_check").show();
          
        // }
        $("#audio_player").data("num-plays", $("#audio_player").data("num-plays") + 1);

      });

  $("#start_button").click(function() {
    if (turk.previewMode) {
      $("#mustaccept").show();
    } else {
      $("#start_button").click(function() {$("#mustaccept").show();});
      exp.go();
    }
  });

  exp.go(); //show first slide
}
