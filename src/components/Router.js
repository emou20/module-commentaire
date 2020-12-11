import React from 'react';
import {Switch, Route } from 'react-router-dom';


import DetailArticle from "./DetailArticle";
import ConsoleComment from "./ConsoleComment";

const Router = () => (
    <Switch>
        <Route exact path="/" component={DetailArticle} />
        <Route exact path="/ConsoleComment" component={ConsoleComment} />

    </Switch>
)

export default Router;