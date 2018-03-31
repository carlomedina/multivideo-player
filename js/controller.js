var currentVideo
var durations
var totalDuration
var cumsum
var videos
var video
var seekBar
var videoToSurface = 0

function selectWhichVideo(time) {
	// this ideally can run in O(log n) i think, but i don't want
	// to spend a lot of time. so i'll do an O(n) implementation instead
	for (var i = 0; i < videos.length; i++) {
		if (time >= cumsum[i] & time < cumsum[i+1] ) {
			break
		}
	}
	return i
}

function selectWhichVideoTime(time) {
	return time - cumsum[selectWhichVideo(time)] 
}

function updateSeekBarByVideo() {
	// Calculate the slider value
	var totaTimeElapsed = cumsum[videoToSurface] + videos[videoToSurface].currentTime
	var value = (100 / totalDuration ) * totaTimeElapsed;

	// Update the slider value
	seekBar.value = value;
}

function updateVideoBySeekBar() {
		
		// Calculate the new time
		var time = totalDuration * (seekBar.value / 100);
		videoToSurface = selectWhichVideo(time)
		var timeOfVideo = selectWhichVideoTime(time)

		// change which video is shown
		document.getElementsByClassName("active")[0].setAttribute("class", "video") // change class = "videos active" to class = "videos"
		
		// restart the current video
		video.pause()
		video.currentTime = 0

		// change to the target video
		video = videos[videoToSurface]
		document.getElementsByClassName("video")[videoToSurface].classList.add('active');

		// Update the video time
		video.currentTime = timeOfVideo;
		video.play();
	}

function startRestartListeners() {
	
}

$(window).on('load', function() {
	// Video
	

		videos = document.getElementsByClassName('video')
		console.log(videos)
		video = videos[videoToSurface]


		currentVideo = {
			index: 0,
			videoTime : 0,
			overallTime : 0
		}

		// Get video durations

		// wait for metadata to load
		// i tried adding a listener before, but it was just too much effort to do properly
		// TO DO: make this less dank
		setTimeout(function() {
		durations = []
		
		for (var i = 0; i < videos.length; i++) {

			// wait for the metadata to load before pushing
			durations.push(videos[i].duration)
		}

		totalDuration = durations.reduce((a,b) => a+b, 0)

		cumsum = [0]
		for (var i = 1; i < videos.length; i++) {
			cumsum.push(cumsum[i-1]+durations[i])
		}
		cumsum.push(totalDuration)

		}, 1500)
		

		

	// Buttons
	var playButton = document.getElementById("play-pause");
	var muteButton = document.getElementById("mute");
	var fullScreenButton = document.getElementById("full-screen");

	// Sliders
	seekBar = document.getElementById("seek-bar");
	var volumeBar = document.getElementById("volume-bar");


	// Event listener for the play/pause button
	playButton.addEventListener("click", function() {
		if (video.paused == true) {
			// Play the video
			video.play();

			// Update the button text to 'Pause'
			playButton.innerHTML = "Pause";
		} else {
			// Pause the video
			video.pause();

			// Update the button text to 'Play'
			playButton.innerHTML = "Play";
		}
	});


	// Event listener for the mute button
	muteButton.addEventListener("click", function() {
		if (video.muted == false) {
			// Mute the video
			video.muted = true;

			// Update the button text
			muteButton.innerHTML = "Unmute";
		} else {
			// Unmute the video
			video.muted = false;

			// Update the button text
			muteButton.innerHTML = "Mute";
		}
	});


	// // Event listener for the full-screen button
	// fullScreenButton.addEventListener("click", function() {
	// 	if (video.requestFullscreen) {
	// 		video.requestFullscreen();
	// 	} else if (video.mozRequestFullScreen) {
	// 		video.mozRequestFullScreen(); // Firefox
	// 	} else if (video.webkitRequestFullscreen) {
	// 		video.webkitRequestFullscreen(); // Chrome and Safari
	// 	}
	// });


	// Event listener for the seek bar
	seekBar.addEventListener("change", updateVideoBySeekBar);

	
	// if current segment ended, switch the video to the next segment
	video.addEventListener("ended", function() {
		if (videoToSurface < (videos.length)) {
			videoToSurface++
			video = videos[videoToSurface]
			// make sure to start from te beginning
			video.currentTime = 0
			video.play()

			// restart the listenerssss
				video.addEventListener("timeupdate", updateSeekBarByVideo);

				// Pause the video when the seek handle is being dragged
				seekBar.addEventListener("mousedown", function() {
					video.pause();
				});

				// Play the video when the seek handle is dropped
				seekBar.addEventListener("mouseup", function() {
					video.play();
				});

				// Event listener for the volume bar
				volumeBar.addEventListener("change", function() {
					// Update the video volume
					video.volume = volumeBar.value;
				});

			// move the active class to the new video segment
			document.getElementsByClassName("active")[0].setAttribute("class", "video") // change class = "videos active" to class = "videos"
			document.getElementsByClassName("video")[videoToSurface].classList.add('active');
		}
	})



	// Update the seek bar as the video plays
	video.addEventListener("timeupdate", updateSeekBarByVideo);

	// Pause the video when the seek handle is being dragged
	seekBar.addEventListener("mousedown", function() {
		video.pause();
	});

	// Play the video when the seek handle is dropped
	seekBar.addEventListener("mouseup", function() {
		video.play();
	});

	// Event listener for the volume bar
	volumeBar.addEventListener("change", function() {
		// Update the video volume
		video.volume = volumeBar.value;
	});
}
);