import React from 'react';
import ReactDOM from 'react-dom';
import PdfController from './../PresentationController.js';

export default class Presentation extends React.Component {
	constructor(props) {
		super(props);
		this.state = {presentation: ""}
		this.renderPdf = this.renderPdf.bind(this);
		this.prevPage = this.prevPage.bind(this);
		this.nextPage = this.nextPage.bind(this);
		this.queueRenderPage = this.queueRenderPage.bind(this);
		this.inputFile = document.getElementById('inputFile');
		this.pdfController;
		this.pageNum = 1;
		this.pageRendering = false;
	}

	componentDidMount() {
		$('#sendPresentation').click(() => {
			//let url = $('#urlPresentation').val();
			//this.props.con.emit('sendingPresentation', {key: $('#room').val(), val: url});

		});
		inputFile.addEventListener('change', (file) => {
			let fileName = $('#inputFile').val().split('\\').pop();
			$('#inputFile').next('.custom-file-label').addClass("selected").html(fileName);
			this.pdfController = new PdfController(fileName, file.target.files[0]);
			this.pdfController.readFile()
				.then((content) => {
					var binaryPdf = this.pdfController.convertToBinary(content);
					return this.pdfController.getDocument(binaryPdf);
				})
				.then((pdf) => {
					this.setState({ presentation: pdf });
					return this.pdfController.getPage(pdf, 1);
				})
				.then((page) => {
					console.log(page);
					this.renderPdf(page);
				})
				.catch((error) => {
				console.log(error);
			});
		})
		$('.custom-file-input').on('change', (val) => {

		});
		this.props.con.on('newPresentation', (urlPresentation) => {
            let checkUrl = urlPresentation.indexOf("https://docs.google.com/");
			if (checkUrl != -1) {
				this.setState({ presentation: urlPresentation });
			}
		});
	}

	getPage(num) {
		this.pdfController.getPage(this.state.presentation, num)
			.then((page) => {
				this.renderPdf(page);
			})
			.catch((error) => {
				console.log(error);
			});
	}

	renderPdf(page) {
		this.pageRendering = true;
		let canvas = document.getElementById('pdfCanvas');
		let context = canvas.getContext('2d');
		let viewport = page.getViewport(this.props.width / page.getViewport(1.0).width);
		let renderContext = {
				canvasContext: context,
				viewport: viewport
		};

		page.render(renderContext)
			.then(() => {
				this.pageRendering = false;
				console.log('Page rendered');
			}
		);
		$('#pageNum').text(this.pageNum);
	}

	queueRenderPage(num) {
		this.pageRendering ? this.pageNumPending = num : this.getPage(num);
	}

	nextPage() {
		if (pageNum >= this.state.presentation.numPages)
			return;
		this.pageNum++;
		this.queueRenderPage(this.pageNum);
	}

	prevPage() {
		if (pageNum <= 1)
			return;
		this.pageNum--;
		this.queueRenderPage(this.pageNum);
	}

	render() {
		var item = this.state.presentation;
		item = item;
		return (
            <div className="noMargin">

                {item == "" ?
                    <div className="alert alert-info align-middle" display="inline-block" role="alert">
                        No ha cargado ninguna presentación.
                    </div>
                :
					<div className="noMargin">
						<canvas id="pdfCanvas" width={this.props.width} height={this.props.height - 50}></canvas>
						<a href="javascript:" onClick={this.prevPage} className="badge badge-dark">&lt;</a>
	
						<span className="badge badge-light">
							Page:
							<span className="badge badge-light" id="pageNum">
							</span>
							/
							<span className="badge badge-light" id="pageCount">
								{this.state.presentation.numPages}
							</span>
						</span>
						<a href="javascript:" onClick={this.nextPage} className="badge badge-dark">&gt;</a>
					</div>
                    /*<iframe src={item} width={this.props.width} height={this.props.height} frameBorder="0" allowFullScreen="true" mozallowfullscreen="true" webkitallowfullscreen="true"></iframe>*/
                }
            </div>
		)
	}
}
