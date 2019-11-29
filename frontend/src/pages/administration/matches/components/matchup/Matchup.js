import React, {useState} from 'react';
import {Table} from "../../../../../organisms/Table";
import {CustomSelect} from "../../../../../atoms/Select";
import {useApi} from "../../../../../hooks/useApi";
import Image from "react-bootstrap/esm/Image";
import loadingGif from "../../../../../assets/images/loading.gif";
import {Heading} from "../../../../../atoms";
import Button from "react-bootstrap/Button";
import {AddGoalSuspensionModal} from "../events/AddGoalSuspensionModal";
import {addPlayer, deletePlayer, setGoalkeeper} from "../../../../../api/matchup/matchupClient_v1";
import {DeleteModal} from "../../../../../atoms/DeleteModal";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import * as Icons from "@fortawesome/free-solid-svg-icons"

export function Matchup({id_team, id_match, host, availablePlayers, fetchAvailablePlayers, matchupState, fetchMatchup, fetchEvents}) {
    const api = useApi();

    const [showGoalModal, setShowGoalModal] = useState({ show: false });
    const closeGoalSuspensionModal = () => setShowGoalModal(false);
    const openGoalSuspensionModal = (id_user) => setShowGoalModal({
        show: true,
        id_user: id_user
    });

    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const [ID, setID] = useState(null);

    const columnsMatchup = [
        {
            Header: "Hráč",
            accessor: "name"
        },
        {
            accessor: "goalkeeper",
            Header: "Brankář",
            Cell: row => (
                <div>
                    {row.original.goalkeeper ? <span>Ano</span> : <span>Ne&nbsp;</span>}
                    <Button variant="link" onClick={async () => {
                        const result = await setGoalkeeper(api, row.original.id_matchup, row.original.goalkeeper)
                        if(result){
                            fetchMatchup();
                        }
                    }}
                    >
                        Změnit
                    </Button>
                </div>
            ),
            filterMethod: (filter, row) => {
                if (filter.value === 'all') {
                    return true;
                } else {
                    return row[filter.id] === Number(filter.value);
                }
            },

            Filter: ({filter, onChange}) =>
                <select
                    onChange={event => onChange(event.target.value)}
                    style={{width: "100%"}}
                    value={filter ? filter.value : "all"}
                >
                    <option value="all">Vše</option>
                    <option value={1}>Ano</option>
                    <option value={0}>Ne</option>
                </select>
        },
        {
            Header: 'Akce',
            accessor: "id_matchup",
            filterable: false,
            Cell: row => (
                <div>
                    <Button variant="link" onClick={() => openGoalSuspensionModal(row.original.id_user)}>
                        <FontAwesomeIcon className="addIcon" icon={Icons.faPlus} size="1x"/>
                    </Button>
                    <Button variant="link" onClick={() => {
                        setID({id_matchup: row.original.id_matchup, id_user: row.original.id_user});
                        handleShow();
                    }}>
                        <FontAwesomeIcon className="removeIcon" icon={Icons.faTrashAlt} size="1x"/>
                    </Button>
                </div>
            )
        }
    ];

    const handleAddPlayer = async (id_user) => {
        const result = await addPlayer(api, {id_team: id_team, id_match: id_match, id_user: id_user, host: host, goalkeeper: false});
        if(result) {
            fetchMatchup();
            fetchAvailablePlayers();
        }
    };

    const handleDeletePlayer = async (id) => {
        const result = await deletePlayer(api, id.id_matchup, id.id_user);
        if(result) {
            fetchMatchup();
            fetchAvailablePlayers();
            fetchEvents();
        }
    };

    return (
        <div>
            <Heading size="lg" className="mt-5 h3MatchDetail text-left">Soupiska</Heading>
            {matchupState.isLoading &&  <div className="text-center"><Image src={loadingGif}/></div>}
            {(!matchupState.isLoading && matchupState.error) &&
            <Heading size="xs" className="alert-danger pt-2 pb-2 mt-2 text-center">Data se nepodařilo načíst</Heading>}
            {(!matchupState.isLoading && !matchupState.error) &&
                <div>
                    { availablePlayers.isLoading &&  <div className="text-center"><Image src={loadingGif}/></div>}
                    {(!availablePlayers.isLoading && availablePlayers.error) &&
                        <Heading size="xs" className="alert-danger pt-2 pb-2 mt-2 text-center">Data se nepodařilo načíst</Heading>
                    }
                    {(!availablePlayers.isLoading && !availablePlayers.error && availablePlayers.players.length === 0) &&
                        <Heading size="xs" className="alert-warning pt-2 pb-2 mt-2 text-center">Nejsou dostupní žádní další hráči</Heading>
                    }
                    {(!availablePlayers.isLoading && !availablePlayers.error && availablePlayers.players.length !== 0) &&
                        <CustomSelect name="id_type" label="Přidání hráče do sestavy"
                                      options={availablePlayers.players}
                                      getOptionLabel={option => `${option.name}`}
                                      getOptionValue={option => `${option.id_user}`}
                                      placeholder={host ? "Hráči host" : "Hráči guest"}
                                      isSearchable={true}
                                      isOptionDisabled={(option) => option.disabled === true}
                                      onChange={options => handleAddPlayer(options.id_user)}
                        />
                    }
                    <Table className="defaultCursor" columns={columnsMatchup} data={matchupState.matchup}/>
                    <AddGoalSuspensionModal params={showGoalModal} handleClose={closeGoalSuspensionModal} matchup={matchupState.matchup}
                                 id_team={id_team} id_match={id_match} host={host} fetchEvents={fetchEvents}
                    />
                    <DeleteModal key="players" show={show} heading="Delete hráče ze zápasu"
                                 text="Opravdu si přejete odstranit hráče ze zápasu a tím i všechny eventy, na které je navázán?"
                                 handleClose={handleClose} deleteFunction={handleDeletePlayer} idItem={ID}/>
                </div>
            }
        </div>
    );

}
