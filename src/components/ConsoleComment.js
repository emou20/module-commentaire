import React, { Component } from 'react';
import Axios from 'axios';
import { NotificationContainer, NotificationManager } from 'react-notifications';
import {Table, TabContent, TabPane, Nav, NavItem, NavLink, Row, Col } from 'reactstrap';
import classnames from 'classnames';
import { BsFillTrashFill } from "react-icons/bs";
import { BsCheck } from "react-icons/bs";


export default class ConsoleComment extends Component {
        state = {
            activeTab:'1',
            commentNonValid:[],
            commentValid:[],
            aucuncommentaireNonValid: "",
            aucuncommentaireValid: "",
        }

        componentDidMount() {
          Axios.get("http://localhost/apiCommentaire/afficheCommentairesNonValide.php")
          .then(res => { 
              const TableCommentNonValid = res.data;
              console.log("res.data", res.data);
              if(res.data === "Aucun commentaires"){
                this.setState({ 
                  aucuncommentaireNonValid:res.data
                  
                });
              }else{
                this.setState({ 
                  commentNonValid:TableCommentNonValid
                });
              }
            
          })


          Axios.get("http://localhost/apiCommentaire/afficheCommentairesValide.php")
          .then(res2 => { 
              const TableCommentValid = res2.data;
              console.log("res2.data", res2.data);
              if(res2.data === "Aucun commentaires"){
                this.setState({ 
                  aucuncommentaireValid:res2.data
                  
                });
              }else{
                this.setState({ 
                  commentValid:TableCommentValid
                });
              }
          })



          


        }

        toggle(tab){
            if(this.state.activeTab !== tab){
                this.setState({
                    activeTab:tab
                })
            }
            
            
          };

          suppComment(idCommentaire){
            Axios({
              method: 'POST',
              url: 'http://localhost/apiCommentaire/deleteCommentaire.php',
              headers: {
                  'Content-Type': 'application/json',
              },
              data: idCommentaire
            })
            .then((response) => {
              if (response.data === "OK") {
                  NotificationManager.success("la suppression a été effectué avec succée"); 
                 
                  setTimeout(() => {
                    window.location.reload(true);
                }, 3000);
                  
              } else {
                NotificationManager.error("Erreur de suppression !");
              }
            })
            .catch((error) => {
                console.log(error)
            })

          };


          validComment(idCommentaire){

              Axios({
                method: 'POST',
                url: 'http://localhost/apiCommentaire/validCommentaire.php',
                headers: {
                    'Content-Type': 'application/json',
                },
                data: idCommentaire
              })
              .then((response) => {
                if (response.data === "OK") {
                    NotificationManager.success("le commentaire a été validé"); 
                    setTimeout(() => {
                      window.location.reload(true);
                  }, 3000);
                    
                } else {
                  NotificationManager.error("Erreur d'envoie !");
                }
              })
              .catch((error) => {
                  console.log(error)
              })

            
              
          }
          

    render() {


      
      let listeCommentActif;
      let listeCommentNonActif;

      console.log("this.state.aucuncommentaireValid", this.state.aucuncommentaireValid);
      console.log("this.state.aucuncommentaireNonValid", this.state.aucuncommentaireNonValid);
      if(this.state.aucuncommentaireValid === ""){
        listeCommentActif = this.state.commentValid.map(el => (
          <tr>
            <th scope="row">{el.id_commentaire}</th>
            <td>{el.id_article}</td>
            <td>{el.nom}</td>
            <td>{el.objet}</td>
            <td>{el.mail}</td>
            <td>{el.corp}</td>
            <td>{el.id_commentaire_parent}</td>
            <td>{el.destinataire}</td>
            <td>
              
              <button className="suppBtt" onClick={() => this.suppComment(el.id_commentaire)}><BsFillTrashFill /></button></td>
          </tr>
        ));
      }else{
        listeCommentActif = <div className="msgvide">{this.state.aucuncommentaireValid}</div>
      };








      if(this.state.aucuncommentaireNonValid === ""){
        listeCommentNonActif = this.state.commentNonValid.map(el => (
          <tr>
            <th scope="row">{el.id_commentaire}</th>
            <td>{el.id_article}</td>
            <td>{el.nom}</td>
            <td>{el.objet}</td>
            <td>{el.mail}</td>
            <td>{el.corp}</td>
            <td>{el.id_commentaire_parent}</td>
            <td>{el.destinataire}</td>
            <td><button className="suppBtt" onClick={() => this.suppComment(el.id_commentaire)}><BsFillTrashFill /></button></td>
            <td><button className="validBtt" onClick={() => this.validComment(el.id_commentaire)}><BsCheck /></button></td>
          </tr>
        ));
      }else{
        listeCommentNonActif = <div className="msgvide">{this.state.aucuncommentaireNonValid}</div>
      };

      
      

        return (
            <div className="container">
              <h1>Gestion de commentaires</h1>
              <NotificationContainer />
      <Nav tabs>
        <NavItem>
          <NavLink
            className={classnames({ active: this.state.activeTab === '1' })}
            onClick={() => this.toggle('1')}
          >
            Commentaires nom validé
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink
            className={classnames({ active: this.state.activeTab === '2' })}
            onClick={() => this.toggle('2')}
          >
            Commentaires validé
          </NavLink>
        </NavItem>
      </Nav>
      <TabContent activeTab={this.state.activeTab}>
        <TabPane tabId="1">
          <Row>
            <Col sm="12">
            <Table>
            <thead>
        <tr>
          <th>#ID Commentaire</th>
          <th>ID Article</th>
          <th>Nom</th>
          <th>Objet</th>
          <th>Mail</th>
          <th>Contenu</th>
          <th>ID commentaire parent</th>
          <th>Destinataire</th>
          <th></th>
          <th></th>
        </tr>
      </thead>
      <tbody>
      
      {listeCommentNonActif}
        
      </tbody>
    </Table>
            </Col>
          </Row>
        </TabPane>
        <TabPane tabId="2">
          <Row>
          <Col sm="12">
            <Table>
      <thead>
        <tr>
        <th>#ID Commentaire</th>
          <th>ID Article</th>
          <th>Nom</th>
          <th>Objet</th>
          <th>Mail</th>
          <th>Contenu</th>
          <th>ID commentaire parent</th>
          <th>Destinataire</th>
          <th></th>
         
        </tr>
      </thead>
      <tbody>
      {listeCommentActif}
        
        
      </tbody>
    </Table>
            </Col>
          </Row>
        </TabPane>
      </TabContent>
    </div>
        )
    }
}
