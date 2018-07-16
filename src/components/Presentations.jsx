import React from 'react';
import ReactDOM from 'react-dom';
import PdfController from './../PresentationController.js';

export default class Presentation extends React.Component {
	constructor(props) {
		super(props);
		this.state = {presentation: "", num: 0}
		this.renderPdf = this.renderPdf.bind(this);
		this.prevPage = this.prevPage.bind(this);
		this.nextPage = this.nextPage.bind(this);
		this.queueRenderPage = this.queueRenderPage.bind(this);
		this.inputFile = document.getElementById('inputFile');
		this.pdfController;
		this.pageNum = 1;
		this.pageRendering = false;
		this.userType = $('#userType').val();
		this.actualPage = 1;
		this.pagesCanvas = [];
		this.pdf = null;
	}

	componentDidMount() {
		$('#sendPresentation').click(() => {
			//let url = $('#urlPresentation').val();
			//this.props.con.emit('sendingPresentation', {key: $('#room').val(), val: url});

		});
		inputFile.addEventListener('change', (file) => {
			this.pageNum = 1;
			this.pagesCanvas = [];
			this.setState({presentation: "", num: 0});
			let fileName = $('#inputFile').val().split('\\').pop();
			$('#inputFile').next('.custom-file-label').addClass("selected").html(fileName);
			this.pdfController = new PdfController(fileName, file.target.files[0]);
			this.pdfController.readFile()
				.then((content) => {
					var binaryPdf = this.pdfController.convertToBinary(content);
					this.props.con.emit('newPdf', {data: content, num: 1});
					return this.pdfController.getDocument(binaryPdf);
				})
				.then((pdf) => {
					this.setState({ presentation: pdf, num: this.actualPage});
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

		})

		this.props.con.on('newPdf', (data) => {
			if (this.userType != "Profesor") {
				this.setState({presentation: "", num: 0});
				this.actualPage = data.num;
				this.convertToPdf(data.data);
			}
		});

		this.props.con.on('updatePage', (data) => {
			if (this.userType != "Profesor") {
				this.setState({presentation: this.state.presentation, num: data});
			}
		});

	}

	componentDidUpdate(prevProps, prevState) {
		if (this.state.num > 0) {
			if ($('#pdfDiv').has("canvas").length) {
				$('canvas').remove();
			}
			$('#pdfDiv').prepend(this.pagesCanvas[this.state.num - 1]);
		}
	}

	convertToPdf(data) {
		this.pdfController = new PdfController();
		var binaryPdf = this.pdfController.convertToBinary(data);
		this.pdfController.getDocument(binaryPdf)
			.then((pdf) => {
				this.setState({ presentation: pdf, num: 0});
				return this.pdfController.getPage(pdf, 1);
			})
			.then((page) => {
				this.renderPdf(page);
			})
			.catch((error) => {
				console.log(error);
			});
	}


	getPage(num) {
		this.pdfController.getPage(this.state.presentation, num)
			.then((page) => {
				return page;
			})
			.catch((error) => {
				console.log(error);
			});
	}

	renderPdf(page) {
		let canvas = document.createElement('canvas');
		let context = canvas.getContext('2d');
		let viewport = page.getViewport(5);
		canvas.width = viewport.width;
		canvas.height = viewport.height;
		canvas.style.width = '100%';
		canvas.style.height = this.userType === "Profesor" ? '88%' : '100%';


		let renderContext = {
				canvasContext: context,
				viewport: viewport
		};
		page.render(renderContext)
			.then(() => {
				if (this.pageNum < this.state.presentation.numPages) {
					console.log(canvas);
					this.pagesCanvas[this.pageNum - 1] = canvas;
					this.pageNum++;
					this.state.presentation.getPage(this.pageNum).then(this.renderPdf);
				}
				else {
					this.pagesCanvas[this.pageNum - 1] = canvas;
					this.setState({presentation: this.state.presentation, num: this.actualPage});
					$('#pageNum').text(1);
				}


			}
		);

	}

	queueRenderPage(num) {
		this.pageRendering ? this.pageNumPending = num : this.getPage(num);
	}

	nextPage() {
		if (this.state.num >= this.state.presentation.numPages)
			return;
		let page = this.state.num + 1;
		this.props.con.emit('currentPage', page);
		this.setState({presentation: this.state.presentation, num: page});
	}

	prevPage() {
		if (this.state.num <= 1)
			return;
		let page = this.state.num - 1;
		this.props.con.emit('currentPage', page);
		this.setState({presentation: this.state.presentation, num: page});
	}


	render() {
		var item = this.state.presentation;
		var user = this.userType;
		return (
            <div className="noMargin">
                {item == "" ?
                    <div className="alert alert-info align-middle" display="inline-block" role="alert">
                        No ha cargado ninguna presentación.
                    </div>
                :
					user == "Profesor" ?
						<div id="pdfDiv" className="noMargin">
							<a href="javascript:" onClick={this.prevPage} className="badge badge-dark">&lt;</a>
							<span className="badge badge-light">
								Page:
								<span className="badge badge-light" id="pageNum">
								{this.state.num}
								</span>
								/
								<span className="badge badge-light" id="pageCount">
								{this.state.presentation.numPages}
								</span>
							</span>
							<a href="javascript:" onClick={this.nextPage} className="badge badge-dark">&gt;</a>
						</div>
						:
						<div id="pdfDiv" className="noMargin">
						</div>
                }
            </div>
		)
	}
}
