
import React, { Component } from 'react';
import { Button, FormGroup, Input, Label } from 'reactstrap';
import { connect } from 'react-redux';
import Axios from 'axios';
import { NotificationContainer, NotificationManager } from 'react-notifications';
import Commentaires from './Commentaires';
import { BiLike } from "react-icons/bi";
import { AiTwotoneLike } from "react-icons/ai";
import { BsPencilSquare } from "react-icons/bs";



class ListeCommentaires extends Component {

    state = {
        commentaires: [],
        idArticle: 1,
        nbrComment: 0,
        etat: 0,
        nom: "",
        objet: "",
        mail: "",
        corp: "",
        idCommentaireParent: 0,
        showMe: "",
        hideAll: "hideAll",
        destinataire: null,
        idCommentEdit: ""

    }

    componentDidMount() {
        this.setState({
            idArticle: this.props.idArticle
        })

        Axios({
            method: 'POST',
            url: 'http://localhost/apiCommentaire/afficheCommentaires.php',
            headers: {
                'Content-Type': 'application/json',
            },
            data: this.state
        })
            .then((response) => {
                if (response.data) {
                    const commentaireOrganiser = [];
                    const commentaireFils = [];
                    const tableauFinale = [];
                    for (var i = 0; i < response.data.length; i++) {
                        if (response.data[i].id_commentaire_parent === "0") {
                            commentaireOrganiser.push(response.data[i]);

                        } else {
                            commentaireFils.push(response.data[i]);
                        }
                    }

                    for (var k = 0; k < commentaireOrganiser.length; k++) {

                        tableauFinale.push(commentaireOrganiser[k]);
                        let elementcourant = commentaireOrganiser[k].id_commentaire;
                        const resultat = commentaireFils.filter(element => element.id_commentaire_parent === elementcourant);
                        if (resultat.length !== 0) {
                            for (var g = 0; g < resultat.length; g++) {
                                tableauFinale.push(resultat[g]);
                            }

                        }
                    }

                    this.setState({
                        commentaires: tableauFinale
                    });
                    const nbrcomments = this.state.commentaires.length;
                    this.setState({
                        nbrComment: nbrcomments
                    });

                } else {
                    NotificationManager.warning("Probleme !");
                }
            })
            .catch((error) => {
                console.log(error)
            })

    }

    repondre(id_commentaire_parent, id_commentaire, nom) {

        let idCommentaireParent = "";
        if (id_commentaire_parent === "0") {
            idCommentaireParent = id_commentaire;
        } else {
            idCommentaireParent = id_commentaire_parent
        }

        this.setState({
            idCommentaireParent: idCommentaireParent,
            showMe: id_commentaire,
            destinataire: nom
        })
    }

    like(id_commentaire, index) {



        const tbRecherche = this.state.commentaires;
        let nbrlikeNv = tbRecherche[index].nbrLike + 1;
        tbRecherche[index].nbrLike = nbrlikeNv;

        this.setState({
            commentaires: tbRecherche
        });

        Axios({
            method: 'POST',
            url: 'http://localhost/apiCommentaire/editLikeCommentaire.php',
            headers: {
                'Content-Type': 'application/json',
            },
            data: { "id_commentaire": id_commentaire, "nbrLike": nbrlikeNv }
        })
            .then((response) => {
                if (response.data) {
                    console.log(response.data)
                }

            })


    }

    editComment(id_commentaire, index) {

        const monComment = this.state.commentaires[index].corp;
        this.setState({
            idCommentEdit: id_commentaire,
            corp: monComment
        })
    }
    onEnterPress = (e) => {
        if (e.keyCode === 13 && e.shiftKey === false) {
            e.preventDefault();

            Axios({
                method: 'POST',
                url: 'http://localhost/apiCommentaire/editCorpCommentaire.php',
                headers: {
                    'Content-Type': 'application/json',
                },
                data: { "id_commentaire": this.state.idCommentEdit, "nvComment": this.state.corp }
            })
                .then((response) => {
                    if (response.data === "OK") {
                        this.setState({
                            idCommentEdit: "",
                        });
                        window.location.reload(true);
                    }

                })
        }
    }


    handleChange = event => {

        this.setState({
            [event.target.name]: event.target.value
        });

    };

    handleSubmitReplay = event => {
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
                    this.setState({
                        nom: "",
                        objet: "",
                        mail: "",
                        corp: "",
                    })

                } else {
                    NotificationManager.error("Erreur d'envoie !");
                }
            })
            .catch((error) => {
                console.log(error)
            })

    }




    render() {
        console.log(" state ===>", this.state);
        const { nom, objet, mail, corp } = this.state;
        return (
            <div className="container">
                <NotificationContainer />


                <div className="container conteneurCommentaireListe">
                    <Commentaires />
                    <div className="nbrCommentaire">{this.state.nbrComment} Commentaire(s)</div>
                    {
                        this.state.commentaires.map((el, index) =>

                            <div className={`boxComment class${el.id_commentaire_parent}`} key={index}>
                                <div className="imgAvatar"></div>
                                <div className="restComment">
                                    <div className="container-fluid nomUser">{el.nom}</div>
                                    <div className="container-fluid objetComment">{el.objet}</div>
                                    <div className="container-fluid corpComment">
                                        {el.destinataire !== null ? <span>@{el.destinataire} </span> : <span></span>}

                                        {this.state.idCommentEdit === el.id_commentaire ?
                                            <FormGroup>
                                                <Input type="textarea" name="corp" id="exampleText" value={corp} onKeyDown={this.onEnterPress} onChange={this.handleChange} />
                                            </FormGroup>
                                            :
                                            <div>{el.corp}</div>

                                        }

                                    </div>
                                    <button onClick={() => this.editComment(el.id_commentaire, index)} className="nombreComment"><BsPencilSquare /> </button>
                                    <button onClick={() => this.like(el.id_commentaire, index)} className="nombreComment">{el.nbrLike} {el.nbrLike === 0 ? <BiLike /> : <AiTwotoneLike />} </button>
                                    <button onClick={() => this.repondre(el.id_commentaire_parent, el.id_commentaire, el.nom)} className="bttRepondre">Repondre
          </button>
                                </div>

                                {this.state.showMe === el.id_commentaire ?
                                    <div className="contFormRepondre" >
                                        <form onSubmit={this.handleSubmitReplay}>
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
                                            <input type="hidden" name="id_commentaire_parent" value={el.id_commentaire_parent} />
                                            <input type="hidden" name="id_commentaire" value={el.id_commentaire} />
                                            <div className="contBttInscri">
                                                <Button>Valider</Button>
                                            </div>
                                        </form>
                                    </div>
                                    :
                                    <div className="contFormRepondre"></div>
                                }

                            </div>

                        )
                    }


                </div>
            </div>
        )
    }
}


function mapStateToProps(state) {
    return {
        idArticle: state.idArticle,
    }
}



export default connect(mapStateToProps)(ListeCommentaires);
