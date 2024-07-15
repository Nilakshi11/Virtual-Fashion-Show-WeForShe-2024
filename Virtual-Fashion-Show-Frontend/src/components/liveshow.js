import React, { useEffect, useState } from 'react';
import './User.css';
import './sqpage.css';

const LiveShow = () => {
    const [designs, setDesigns] = useState([]);

    useEffect(() => {
        fetch('http://localhost:5000/getdesigns')
            .then((response) => response.json())
            .then((data) => {
                if (Array.isArray(data)) {
                    setDesigns(data);
                } else {
                    console.error('Data is not an array:', data);
                }
            })
            .catch((error) => console.error('Error fetching designs:', error));
    }, []);

    const handleLike = (id) => {
        fetch(`http://localhost:5000/like/${id}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.status === 'ok') {
                    setDesigns(prevDesigns => 
                        prevDesigns.map(design => 
                            design._id === id ? { ...design, like: design.like + 1 } : design
                        )
                    );
                } else {
                    console.error('Error liking design:', data.error);
                }
            })
            .catch((error) => console.error('Error liking design:', error));
    };

    const handleDislike = (id) => {
        fetch(`http://localhost:5000/dislike/${id}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.status === 'ok') {
                    setDesigns(prevDesigns => 
                        prevDesigns.map(design => 
                            design._id === id ? { ...design, dislike: design.dislike + 1 } : design
                        )
                    );
                } else {
                    console.error('Error disliking design:', data.error);
                }
            })
            .catch((error) => console.error('Error disliking design:', error));
    };

    const handleOrder = (id) => {
        const productLink = 'https://www.myntra.com/29233406?query=%7B%7D';

        window.open(productLink, '_blank');
    };

    return (
        <div className="live-show-container" >
            <div className="display-design">
                <h3>All Designs</h3>
                <div className="design-videos">
                    {designs.map((design) => (
                        <div key={design._id} className="video-item">
                            <div className="design-details-container">
                                <div className="designer-info">
                                    <div className="designer-photo-container">
                                        <img
                                            src={`http://localhost:5000/${design.designerPhoto}`}
                                            alt={`${design.designerName}'s photo`}
                                            className="designer-photo"
                                        />
                                    </div>
                                    <div className="designer-name">
                                        <h4>{design.designerName}</h4>
                                    </div>
                                </div>
                                <div className="design-details">
                                    <h4>Category: {design.category}</h4>
                                    <p>Price: {design.price}</p>
                                    <p>Description: {design.description}</p>
                                    <div className="interaction-buttons">
                                        <button onClick={() => handleLike(design._id)}>Like ({design.like || 0})</button>
                                        <button onClick={() => handleDislike(design._id)}>Dislike ({design.dislike || 0})</button>
                                        <button onClick={() => handleOrder(design._id)}>Order ({design.order || 0})</button>
                                    </div>
                                </div>
                            </div>
                            <div className="video-preview">
                                <video width="480" height="360" controls autoPlay loop>
                                    <source src={`http://localhost:5000/${design.video}`} type="video/mp4" />
                                    Your browser does not support the video tag.
                                </video>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default LiveShow;
