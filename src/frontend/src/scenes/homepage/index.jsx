import React, { useState } from "react";

import styled from "styled-components";
import { withAuth, withLog, withUser } from "../../bridge";
import { Button, Table, Input } from "../../components";
import { format, formatDistanceToNow, subSeconds } from "date-fns";
import ptBr from "date-fns/locale/pt-BR";

const offset = "200px";

const Upper = styled.div`
    min-height: ${offset};
    max-height: ${offset};
`;

export default function Home(props) {
    const auth = withAuth();
    const log = withLog();

    const [state, setState] = useState(() => ({
        log: undefined,
        // new Array(25).fill(0).map((_, index) => ({
        //     timestamp: formatDistanceToNow(subSeconds(new Date(), index * 2), {
        //         locale: ptBr,
        //         addSuffix: true,
        //         includeSeconds: true
        //     }),
        //     user: `uuid_${Math.random()
        //         .toFixed(index + 1)
        //         .replace(/\D/g, "")}`,
        //     metodo: "RFID",
        //     uuid: `uuid_${Math.random()
        //         .toFixed(6)
        //         .replace(/\D/g, "")}`
        // })),
        user: auth.getUser(),
        filter: ""
    }));

    if (state.log === undefined) {
        log.fetchAll(
            logs => {
                setState(s => ({ ...s, log: logs }));
            },
            error => {
                console.error(error);
            }
        );
    } else {
        console.warn("logs", state.log);
        const isAdmin = true; // state.user && state.user.type === "admin";

        const headers = ["Horário", "Nome", "Método"];
        let matrix = state.log
            .filter(_log =>
                Object.values(_log).some(__log => __log.match(state.filter))
            )
            .map(_log => {
                const base = [_log.timestamp, _log.user, _log.metodo];
                if (isAdmin) {
                    base.push(
                        <Button
                            onClick={() => {
                                log.delete(_log.uuid, () => {
                                    setState(state => ({
                                        ...state,
                                        log: state.log.filter(
                                            __log => __log.uuid !== _log.uuid
                                        )
                                    }));
                                });
                            }}
                            content="Deletar"
                        />
                    );
                }
                return base;
            });
        let sizing = ["0.1fr", "2fr", "0.1fr"];

        if (isAdmin) {
            headers.push(" ");
            sizing.push("0.1fr");
        }

        return (
            <>
                <Upper>
                    <div
                        style={{
                            width: "60%",
                            margin: "auto",
                            paddingTop: "100px"
                        }}
                    >
                        <Input
                            label={"Filtrar:"}
                            value={state.filter}
                            onChange={v =>
                                setState({
                                    ...state,
                                    filter: v.target.value.replace(
                                        /\\|\(|\)|\[|\]/g,
                                        ""
                                    )
                                })
                            }
                        />
                    </div>
                </Upper>
                <Table
                    headers={headers}
                    matrix={matrix}
                    sizinsg={sizing}
                    offset={offset}
                />
            </>
        );
    }

    return <div>Loading...</div>;
}
