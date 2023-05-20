// eslint-disable-next-line @typescript-eslint/explicit-function-return-type, @typescript-eslint/no-unused-vars
function eval2(p) {
	p = p.replace('var o={play:false', 'var o;window.parent.o = window.o = o = {play:false');
	return eval.call(window, p);
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
function waitForStreams() {
	window.setTimeout(() => {

		if (!window.o) {
			waitForStreams();
		}
		else {
			const script = [...window.document.body.getElementsByTagName('script')].find(f => f.innerHTML.includes('initCDNMoviesEvents'));
			// console.log('script', script);
			if (script) {
				const regex = /"streams":"(.*?)"/g;
				const match = regex.exec(script.innerText);

				if (match) {
					const newStreamId = match[1].replaceAll('\\/', '/');

					// console.log('newStreamId', newStreamId);
					const newStreams = window.o.FGeRtNzK(newStreamId);
					// console.log('newStreamArray', newStreams);
					const div = document.createElement('div');
					div.id = "result";
					div.innerHTML = newStreams;
					document.body.appendChild(div);

					window.o._translatorsList = document.getElementById('translators-list')
				} else {
					console.error('No streams found.');
				}
			}
			else {
				console.error('script not found');
			}

		}
	}, 100);
}
waitForStreams();

