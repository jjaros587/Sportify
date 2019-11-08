import React from 'react';
import {NavLink as Link, useParams} from "react-router-dom";
import "react-datepicker/dist/react-datepicker.css";

import {Heading} from '../../../atoms';
import {Breadcrumb, Row, Col, Image, Tabs, Tab, OverlayTrigger, Tooltip} from 'react-bootstrap';
import {TeamSquad} from "./components/TeamSquad";
import {useGetTeam} from "../../../api/team/teamClient_v1";
import defaultTeamAvatar from '../../../assets/images/default_team_avatar.jpg';
import {mapSportToIcon} from '../../../utils/mapper';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {TeamCompetitions} from "./components/TeamCompetitions";
import {TeamStatistics} from "./components/TeamStatistics";

export function TeamDetail() {
    let {id_team} = useParams();
    const [state] = useGetTeam(id_team);
    console.log(state)

    return (
        <div>
            {state.isLoading && <div>Načítám data...</div>}
            {!state.isLoading && state.error &&
            <Heading size="xs" className="alert-danger pt-2 pb-2 mt-2 text-center">Data se nepodařilo načíst</Heading>}
            {!state.isLoading &&
            <div>
                <Breadcrumb>
                    <li className="breadcrumb-item"><Link to="/">Domů</Link></li>
                    <li className="breadcrumb-item"><Link to="/teams">Týmy</Link></li>
                    <li className="breadcrumb-item"><span className="active">{state.team_data.name}</span></li>
                </Breadcrumb>
                <Heading className="mt-4 mb-5">{state.team_data.name}</Heading>

                <Row className="mb-5 align-items-center h-100">
                    <Col lg={3} md={12} className="mb-4 mb-lg-0">
                        <div className="avatar-upload">
                            <div className="avatar-preview">
                                <div id="imagePreview">
                                    {state.team_data.avatar
                                        ? <Image roundedCircle src={state.team_data.avatar} fluid/>
                                        : <Image roundedCircle src={defaultTeamAvatar} fluid/>
                                    }
                                </div>
                            </div>
                        </div>
                    </Col>


                    <Col className="mx-auto" lg={8} md={12}>
                        <Row className="teamDetailDesc">
                            <Col md={4} sm={4} xs={6}>
                                <p>Vedoucí týmu</p>
                                <Heading size="xs">{state.team_data.leader}</Heading>
                            </Col>
                            <Col md={4} sm={4} xs={6}>
                                <p>Typ týmu</p>
                                <Heading size="xs">{state.team_data.type}</Heading>
                            </Col>
                            <Col md={4} sm={4} xs={6}>
                                <p>Sport</p>
                                <Heading size="xs">
                                    <OverlayTrigger
                                        overlay={<Tooltip id="tooltip-disabled">{state.team_data.sport}</Tooltip>}>
                                        <FontAwesomeIcon icon={mapSportToIcon(state.team_data.id_sport)} size="2x"/>
                                    </OverlayTrigger>
                                </Heading>
                            </Col>
                        </Row>
                    </Col>
                </Row>

                <Tabs className="mb-3" fill defaultActiveKey="statistics" id="teamTabs">
                    <Tab eventKey="squad" title="Sestava">
                        <TeamSquad/>
                    </Tab>
                    <Tab eventKey="competition" title="Soutěže">
                        <TeamCompetitions/>
                    </Tab>
                    <Tab eventKey="statistics" title="Statistiky">
                        <TeamStatistics/>
                    </Tab>
                </Tabs>
            </div>
            }
        </div>
    );
}
