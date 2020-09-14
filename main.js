document.addEventListener("DOMContentLoaded", function(event) {

	const keyboardFrequencyMap = {
	    '90': 261.625565300598634,  //Z - C
	    '83': 277.182630976872096, //S - C#
	    '88': 293.664767917407560,  //X - D
	    '68': 311.126983722080910, //D - D#
	    '67': 329.627556912869929,  //C - E
	    '86': 349.228231433003884,  //V - F
	    '71': 369.994422711634398, //G - F#
	    '66': 391.995435981749294,  //B - G
	    '72': 415.304697579945138, //H - G#
	    '78': 440.000000000000000,  //N - A
	    '74': 466.163761518089916, //J - A#
	    '77': 493.883301256124111,  //M - B
	    '81': 523.251130601197269,  //Q - C
	    '50': 554.365261953744192, //2 - C#
	    '87': 587.329535834815120,  //W - D
	    '51': 622.253967444161821, //3 - D#
	    '69': 659.255113825739859,  //E - E
	    '82': 698.456462866007768,  //R - F
	    '53': 739.988845423268797, //5 - F#
	    '84': 783.990871963498588,  //T - G
	    '54': 830.609395159890277, //6 - G#
	    '89': 880.000000000000000,  //Y - A
	    '55': 932.327523036179832, //7 - A#
	    '85': 987.766602512248223,  //U - B
	}

	window.addEventListener('keydown', keyDown, false);
	window.addEventListener('keyup', keyUp, false);
	const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

	activeOscillators = {}
	activeGainNodes = {}

	function keyDown(event) {;
	    const key = (event.detail || event.which).toString();
	    if (keyboardFrequencyMap[key] && !activeOscillators[key]) {
	      playNote(key);
	    }
	}

	function keyUp(event) {
	    const key = (event.detail || event.which).toString();
	    //release - removes the 'click'
    	if (keyboardFrequencyMap[key] && activeOscillators[key]) {
    		activeGainNodes[key].gain.setValueAtTime(activeGainNodes[key].gain.value, audioCtx.currentTime);
			activeGainNodes[key].gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.1);
        	activeOscillators[key].stop(audioCtx.currentTime + 0.1);
        	delete activeOscillators[key];
        	delete activeGainNodes[key];
	    }
	    if (Object.keys(activeOscillators).length === 0){
	    	window.document.froggy.src='frog_smile.PNG';
	    }
	}

	function playNote(key) {
		window.document.froggy.src='frog_singing.PNG';
	    const osc = audioCtx.createOscillator();
	    osc.frequency.setValueAtTime(keyboardFrequencyMap[key], audioCtx.currentTime)
	    osc.type = document.forms.waveformForm.waveform.value;
	    const gainNode = audioCtx.createGain();
	    gainNode.gain.setValueAtTime(0, audioCtx.currentTime);
		osc.connect(gainNode).connect(audioCtx.destination);
	    osc.start();
		activeOscillators[key] = osc;
	    activeGainNodes[key] = gainNode;
		//allows for polyphony by dividing by number of notes and keeping max gain 1
		gainValue = 1/(Object.keys(activeGainNodes).length);
		for (let val of Object.values(activeGainNodes)){
			// this line was the one submitted
			// val.gain.setValueAtTime(gainValue, audioCtx.currentTime);
			val.gain.setTargetAtTime(gainValue, audioCtx.currentTime, 0.1);
			// val.gain.setValueAtTime(val.gain.value, audioCtx.currentTime);
			// val.gain.exponentialRampToValueAtTime(gainValue, audioCtx.currentTime + 0.1);
		}
	  }
}, false);
