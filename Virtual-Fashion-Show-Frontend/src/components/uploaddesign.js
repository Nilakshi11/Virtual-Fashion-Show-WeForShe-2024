import React, { Component } from 'react';
import './sqpage.css';
import LiveShow from './liveshow';

export default class DesignRegistration extends Component {
    constructor(props) {
        super(props);
        this.state = {
            category: "",
            video: null,
            price: "",
            size: "",
            description: "",
        };
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleFileChange = (e) => {
        this.setState({ video: e.target.files[0] });
    };

    handleSubmit(e) {
        e.preventDefault();

        const formData = new FormData();
        const designerEmail = window.localStorage.getItem("email");
        
        formData.append('category', this.state.category);
        formData.append('video', this.state.video);
        formData.append('price', this.state.price);
        formData.append('size', this.state.size);
        formData.append('description', this.state.description);
        formData.append('email', designerEmail);

        fetch("http://localhost:5000/uploadform", {
            method: "POST",
            body: formData,
        })
        .then((res) => res.json())
        .then((data) => {
            console.log(data, "designRegister");
            alert("Design uploaded successfully!");
            window.location.reload();
        })
        .catch((error) => {
            console.error("Error registering design:", error);
        });
    }

    render() {
        return (
            <form onSubmit={this.handleSubmit}>
                <h3>Upload Design</h3>

                <div className="mb-3">
                    <label>Category</label>
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Enter category"
                        onChange={(e) => this.setState({ category: e.target.value })}
                    />
                </div>

                <div className="mb-3">
                    <label>Video</label>
                    <input
                        type="file"
                        multiple
                        className="form-control"
                        accept='.mp4, .mkv'
                        onChange={this.handleFileChange}
                    />
                </div>

                <div className="mb-3">
                    <label>Price</label>
                    <input
                        type="number"
                        className="form-control"
                        placeholder="Enter price"
                        onChange={(e) => this.setState({ price: e.target.value })}
                    />
                </div>

                <div className="mb-3">
                    <label>Size</label>
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Enter size available"
                        onChange={(e) => this.setState({ size: e.target.value })}
                    />
                </div>

                <div className="mb-3">
                    <label>Description</label>
                    <textarea
                        className="form-control"
                        placeholder="Enter description"
                        onChange={(e) => this.setState({ description: e.target.value })}
                    />
                </div>

                <div className="d-grid">
                    <button type="submit" className="btn btn-secondary">
                        Register Design
                    </button>
                </div>
            </form>
        );
    }
}
