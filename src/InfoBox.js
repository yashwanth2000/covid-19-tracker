import React from 'react';
import "./InfoBox.css";
import {Card, CardContent, Typography } from '@material-ui/core';

function InfoBox({ title, cases, isRed, active, total, ...props}) {
    return (
        <Card 
            onClick={props.onClick}
            className= {`infoBox ${active && "infoBox--selected"} 
            ${isRed && "infoBox--red"}`} >
            <CardContent>
                {/* Title */}
                <Typography color="textSecondary" className="infoBox__title">
                    {title}
                </Typography>
                
                {/* Number of cases */}
                <h2 className={`infoBox__cases ${!isRed && "infoBox__cases--green"}`}>{cases}</h2>
                
                {/* Total */}
                <Typography color="textSecondary" className="infoBox__total">
                    Total  {total}
                </Typography>
            </CardContent>
        </Card>
    )
}

export default InfoBox
