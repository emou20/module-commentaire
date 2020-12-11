import React, { Component } from 'react';
import Axios from 'axios';
import { NotificationContainer, NotificationManager } from 'react-notifications';
import { connect } from 'react-redux';
import ListeCommentaires from './ListeCommentaires';

class DetailArticle extends Component {
    state = {
        idArticle: 1,
        titre: "",
        corp: "",
    }


    componentDidMount = () => {
        this.props.idArticle(this.state.idArticle)
        Axios({
            method: 'POST',
            url: 'http://localhost/apiCommentaire/afficheDetailArticle.php',
            headers: {
                'Content-Type': 'application/json',
            },
            data: this.state
        })
            .then((response) => {
                if (response.data) {
                    this.setState({
                        titre: response.data.titre,
                        corp: response.data.corp
                    });

                } else {

                    NotificationManager.warning("Probleme !");

                }
            })
            .catch((error) => {
                console.log(error)
            })
    }
    render() {
        const { titre, corp } = this.state
        return (
            <div className="container">
                <NotificationContainer />
                <div className="titreArticle"><h1>{titre}</h1></div>
                <div className="titreArticle">{corp}</div>
                <ListeCommentaires />
                
            </div>
        )
    }
}





const mapDispatchToProps = dispatch => {
    return {
        idArticle: (idArticle) => {
            dispatch({ type: "ID_ARTICLE", idArticle: idArticle, })

        }
    };
};

export default connect("", mapDispatchToProps)(DetailArticle);