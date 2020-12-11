import React, { Component } from 'react';
import { Button, FormGroup, Input, Label } from 'reactstrap';
import { connect } from 'react-redux';
import Axios from 'axios';
import { NotificationContainer, NotificationManager } from 'react-notifications';

class Commentaires extends Component {
    state = {
        idArticle: "",
        etat: 0,
        nom: "",
        objet: "",
        mail: "",
        corp: "",
        idCommentaireParent: 0,
        destinataire: null
    }


    componentDidMount = () => {
        this.setState({
            idArticle: this.props.idArticle
        })
    }

    handleChange = event => {

        this.setState({
            [event.target.name]: event.target.value
        });

    };

    handleSubmit = event => {
        event.preventDefault();

        Axios({
            method: 'POST',
            url: 'http://localhost/apiCommentaire/insertCommentaireParent.php',
            headers: {
                'Content-Type': 'application/json',
            },
            data: this.state
        })
            .then((response) => {
                if (response.data === "OK") {
                    NotificationManager.success("Votre commentaire à été envoyé, un administrateur le validera");

                } else {
                    NotificationManager.error("Erreur d'envoie !");
                }
            })
            .catch((error) => {
                console.log(error)
            })

    }


    render() {
        const { nom, objet, mail, corp } = this.state;
        return (
            <div className="container">
                <NotificationContainer />
                <form onSubmit={this.handleSubmit}>
                    <FormGroup>
                        <Label>Nom</Label>
                        <Input type="text" name="nom" id="exampleNom" placeholder="" value={nom} onChange={this.handleChange} />

                    </FormGroup>
                    <FormGroup>
                        <Label>Objet</Label>
                        <Input type="text" name="objet" id="exampleNom" placeholder="" value={objet} onChange={this.handleChange} />

                    </FormGroup>
                    <FormGroup>
                        <Label>Mail</Label>
                        <Input type="email" name="mail" id="exampleNom" placeholder="" value={mail} onChange={this.handleChange} />

                    </FormGroup>
                    <FormGroup>
                        <Label for="exampleText">Contenu</Label>
                        <Input type="textarea" name="corp" id="exampleText" value={corp} onChange={this.handleChange} />
                    </FormGroup>
                    <div className="contBttInscri">
                        <Button>Valider</Button>
                    </div>
                </form>
            </div>
        )
    }
}


function mapStateToProps(state) {
    return {
        idArticle: state.idArticle,
    }
}



export default connect(mapStateToProps)(Commentaires);