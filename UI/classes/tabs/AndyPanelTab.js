class AndyPanelTab {
	constructor(tabPane,that) {
		// Create a container for the debug panel content
		console.log(tabPane,that)
		let andyContainer = createElement(tabPane, "div", ["container-full"]);
		that.HTMLNodes.andyContainer = andyContainer;

		// Add a title for the debug panel
		let andyTitle = createElement(andyContainer, "h2", ["sub-title"]);
		andyTitle.innerText = "ANDY";
	    that.HTMLNodes.andyTitle = andyTitle;

            let container=createElement(tabPane, "div", ["script_input"]);
            this.status=createElement(container, "p", ["script_input"]);
            this.status.innerText="NOT YET";
            this.tx=createElement(container, "textarea", ["script_input"]);
            this.tx.innerText="Hello from andy.\nThis is a multi line text fiend\nThat I can Cut and Paste\n"
            this.tx.style.height="100%"
            this.tx.style.width="100%"
            this.results={}
            this.createButton(container, "Read", ["dump-button"], () => this.readScripts());
            this.createButton(container, "Copy", ["dump-button"], () => this.copyToClipboard(this.tx.innerText));
            //readScripts();
	}


    readScripts() {
        let sids=document.querySelectorAll("script");
        this.tx.innerText="ping"
        this.status.innerText="Collecting."

        var ctr=0;
        
        for(var sid in sids) {
            let s=sids[sid];
            let script=s.src;
            this.results[script]="...";
            
            fetch(script).then((resp)=> {
                if(resp.ok) {
                    return resp.text();
                }
                ctr --;
                this.status.innerText=`${ctr} to come.`
            }).then ( (text) => {
                this.results[script]=text;                
                this.tx.innerText=JSON.stringify(this.results);
            })

            ctr += 1;
        }
        this.status.innerText=`${ctr} to come.`
        this.tx.innerText=JSON.stringify(this.results);
    }
    
	// Logs to the debug panel
	_logToDebugPanel(message) {
		let currentContent = that.HTMLNodes.debugOutput.getValue();
		let updatedContent = currentContent + message + "\n";
		that.HTMLNodes.debugOutput.setValue(updatedContent);
		that.HTMLNodes.debugOutput.scrollTo(null, that.HTMLNodes.debugOutput.getScrollInfo().height);
	}

    // Helper to create buttons
	createButton(parent, text, classList, callback) {
		let button = createElement(parent, "button", classList);
		button.innerText = text;
		button.addEventListener("click", callback);
		return button;
	}

// Copy text to clipboard
	copyToClipboard(text) {
		if (navigator.clipboard) {
			navigator.clipboard.writeText(text).then(() => {
				//that._logToDebugPanel("Debug output copied to clipboard.");
			}).catch(err => {
				//that._logToDebugPanel("Failed to copy text: " + err);
			});
		} else {
			const textarea = document.createElement("textarea");
			textarea.value = text;
			document.body.appendChild(textarea);
			textarea.select();
			try {
				document.execCommand("copy");
				//that._logToDebugPanel("Debug output copied to clipboard.",that);
			} catch (err) {
				//that._logToDebugPanel("Failed to copy text: " + err,that);
			}
			textarea.classList.add("hide");
			document.body.removeChild(textarea);
		}
	}
}

export default AndyPanelTab;
