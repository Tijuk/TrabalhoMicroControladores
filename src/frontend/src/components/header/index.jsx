import React from "react";
import styled from "styled-components";
import Button from "../button";
import { withAuth } from "../../bridge";
import { color } from "../../assets";

import { Link } from "react-router-dom";

const _ = {
    Main: styled.span`
        display: flex;
        padding: 0px 20px;
        align-items: center;
    `,
    buttons: {
        Container: styled.div`
            display: flex;
            justify-content: flex-end;
            margin-left: auto;
        `,
        Wrapper: styled.div`
            align-items: space-between;
        `
    },
    Title: styled.span`
        font-size: 48px;
        line-height: 48px;
        margin: 0px;
        font-weight: 800;
        font-family: Consolas;

        &:hover {
            cursor: pointer;
        }
    `,
    Name: styled.span`
        font-size: 14px;
        line-height: 14px;
        margin-left: 20px;
    `
};

export default function Header(props) {
    const auth = withAuth();

    function headerButtons() {
        const headerButton = (content, linkTo, additionalAction = null) => (
            // (<Link to={linkTo}>
            // 	<Button onClick={additionalAction} type="nav" content={content} />
            // </Link>)
            <Button
                onClick={additionalAction || (() => props.redirect(linkTo))}
                type="nav"
                content={content}
            />
        );

        const logOutAction = async () => {
            await auth.logout(() => {
                props.redirect("/");
            });
        };

        const allButtons = [headerButton("Home", "/")];

        const logOutButton = (
            <Button type="nav" content="Log Out" onClick={logOutAction} />
        );
        if (auth.guard()) {
            allButtons.push(logOutButton);
        } else {
            allButtons.push(
                headerButton("Log in", "/login"),
                headerButton("Cadastro", "/cadastro")
            );
        }

        return (
            <_.buttons.Container>
                {allButtons.map((item, index) => (
                    <_.buttons.Wrapper key={`0081hjnt13j193r_${index}`}>
                        {item}
                    </_.buttons.Wrapper>
                ))}
            </_.buttons.Container>
        );
    }

    return (
        <_.Main>
            <_.Title>Controle de Acesso</_.Title>
            {auth.guard() && <_.Name>{`Olá,\n${auth.getUser().name}`}</_.Name>}
            {headerButtons()}
        </_.Main>
    );
}
