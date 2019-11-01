import React, {useState} from 'react';
import {Heading, MainSection} from '../../atoms';
import {TopNavigation} from '../../organisms/TopNavigation';
import {CardTemplate} from '../../templates/CardTemplate';
import {
    Form,
    Button,
    Row,
    Col,
    Image,
    Modal,
    Breadcrumb,
} from 'react-bootstrap';
import {Footer} from '../../organisms/Footer';
import * as Icons from '@fortawesome/free-solid-svg-icons';
import {useHistory} from "react-router";
import {useAuth} from "../../utils/auth";
import {useApi} from "../../utils/api";
import {GetUser, ChangeData, ChangePassword} from "../../api/user/userAPI";
import {Formik} from "formik";
import * as yup from 'yup';

const schemaChangeData = yup.object().shape({
    name: yup.string().required(),
    surname: yup.string().required(),
});

const schemaChangePassword = yup.object().shape({
    oldPassword: yup.string().required(),
    newPassword1: yup.string().matches(/(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]){6}/).required(),
    newPassword2: yup.string().required().oneOf([yup.ref('newPassword1')]),
});

export function Profile() {
    const history = useHistory();
    const { user } = useAuth();
    const api = useApi();
    if(!user) {
        history.replace('/');
    }

    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const [state] = GetUser(user.id_user);

    return (
        <div>
            <TopNavigation/>
            <MainSection>
                <Breadcrumb>
                    <Breadcrumb.Item href="/">Domů</Breadcrumb.Item>
                    <Breadcrumb.Item active>Administrace</Breadcrumb.Item>
                    <Breadcrumb.Item active>Profil</Breadcrumb.Item>
                </Breadcrumb>
                <Heading className="pageHeading mt-4 mb-5">Uživatelský profil</Heading>
                {!state.gettingData &&
                <div>
                    <Formik
                        validationSchema={schemaChangeData}
                        initialValues={{
                            name: state.user_data.name,
                            surname: state.user_data.surname
                        }}
                        onSubmit={values => {
                            const { name, surname } = values;
                            ChangeData(api, user.id_user, name, surname);
                    }}
                    >{({ handleSubmit, handleChange, errors }) => (
                        <Form noValidate onSubmit={handleSubmit}>
                            <Row>
                                <Col className="d-xl-none text-center mb-5">
                                    <Image fluid
                                           src="data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%22171%22%20height%3D%22180%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20171%20180%22%20preserveAspectRatio%3D%22none%22%3E%3Cdefs%3E%3Cstyle%20type%3D%22text%2Fcss%22%3E%23holder_16dfe80083d%20text%20%7B%20fill%3A%23999%3Bfont-weight%3Anormal%3Bfont-family%3A-apple-system%2CBlinkMacSystemFont%2C%26quot%3BSegoe%20UI%26quot%3B%2CRoboto%2C%26quot%3BHelvetica%20Neue%26quot%3B%2CArial%2C%26quot%3BNoto%20Sans%26quot%3B%2Csans-serif%2C%26quot%3BApple%20Color%20Emoji%26quot%3B%2C%26quot%3BSegoe%20UI%20Emoji%26quot%3B%2C%26quot%3BSegoe%20UI%20Symbol%26quot%3B%2C%26quot%3BNoto%20Color%20Emoji%26quot%3B%2C%20monospace%3Bfont-size%3A10pt%20%7D%20%3C%2Fstyle%3E%3C%2Fdefs%3E%3Cg%20id%3D%22holder_16dfe80083d%22%3E%3Crect%20width%3D%22171%22%20height%3D%22180%22%20fill%3D%22%23373940%22%3E%3C%2Frect%3E%3Cg%3E%3Ctext%20x%3D%2260.875%22%20y%3D%2295.2828125%22%3E171x180%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E"
                                           roundedCircle/>
                                </Col>

                                <Col xl={10} lg={12}>
                                    <Row>
                                        <Col xl={{span: 6, offset: 0}} lg={{span: 4, offset: 2}}
                                             md={{span: 6, offset: 0}}>
                                            <Form.Group controlId="name">
                                                <Form.Label>Jméno</Form.Label>
                                                <Form.Control type="text"
                                                              name="name"
                                                              defaultValue={state.user_data.name}
                                                              onChange={handleChange}
                                                              isInvalid={!!errors.name}/>
                                                <Form.Control.Feedback type="invalid">
                                                    Vyplňte Vaše jméno.
                                                </Form.Control.Feedback>
                                            </Form.Group>
                                        </Col>
                                        <Col xl={{span: 6, offset: 0}} lg={{span: 4, offset: 0}}
                                             md={{span: 6, offset: 0}}>
                                            <Form.Group controlId="surname">
                                                <Form.Label>Příjmení</Form.Label>
                                                <Form.Control type="text"
                                                              name="surname"
                                                              defaultValue={state.user_data.surname}
                                                              onChange={handleChange}
                                                              isInvalid={!!errors.surname}/>
                                                <Form.Control.Feedback type="invalid">
                                                    Vyplňte Vaše příjmení.
                                                </Form.Control.Feedback>
                                            </Form.Group>
                                        </Col>
                                    </Row>

                                    <Row>
                                        <Col xl={{span: 6, offset: 0}} lg={{span: 8, offset: 2}}>
                                            <Form.Label>Email</Form.Label>
                                            <Form.Control readOnly name="email" defaultValue={state.user_data.email}/>
                                        </Col>

                                        <Col xl={{span: 3, offset: 0}} lg={{span: 4, offset: 2}}>
                                            <Button className="mt4" type="submit" block>
                                                Uložit Profil
                                            </Button>
                                        </Col>

                                        <Col xl={{span: 3, offset: 0}} lg={{span: 4, offset: 0}}>
                                            <Button className="mt4" type="button" block onClick={handleShow}>
                                                Změna hesla
                                            </Button>
                                        </Col>

                                    </Row>
                                </Col>

                                <Col className="d-none d-xl-block">
                                    <Image roundedCircle
                                           src="data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%22171%22%20height%3D%22180%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20171%20180%22%20preserveAspectRatio%3D%22none%22%3E%3Cdefs%3E%3Cstyle%20type%3D%22text%2Fcss%22%3E%23holder_16dfe80083d%20text%20%7B%20fill%3A%23999%3Bfont-weight%3Anormal%3Bfont-family%3A-apple-system%2CBlinkMacSystemFont%2C%26quot%3BSegoe%20UI%26quot%3B%2CRoboto%2C%26quot%3BHelvetica%20Neue%26quot%3B%2CArial%2C%26quot%3BNoto%20Sans%26quot%3B%2Csans-serif%2C%26quot%3BApple%20Color%20Emoji%26quot%3B%2C%26quot%3BSegoe%20UI%20Emoji%26quot%3B%2C%26quot%3BSegoe%20UI%20Symbol%26quot%3B%2C%26quot%3BNoto%20Color%20Emoji%26quot%3B%2C%20monospace%3Bfont-size%3A10pt%20%7D%20%3C%2Fstyle%3E%3C%2Fdefs%3E%3Cg%20id%3D%22holder_16dfe80083d%22%3E%3Crect%20width%3D%22171%22%20height%3D%22180%22%20fill%3D%22%23373940%22%3E%3C%2Frect%3E%3Cg%3E%3Ctext%20x%3D%2260.875%22%20y%3D%2295.2828125%22%3E171x180%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E"/>
                                </Col>
                            </Row>
                        </Form>
                        )}
                    </Formik>

                    <h2 className="mt-4">Týmy</h2>
                    <Row>
                        <CardTemplate nazev="Tým 1" icon={Icons.faFutbol} sport="fotbal" logo="http://bit.ly/32Z7Hfl"/>
                        <CardTemplate nazev="Tým 2" icon={Icons.faFutbol} sport="fotbal" logo="http://bit.ly/2PrDmSC"/>
                        <CardTemplate nazev="Tým 3" icon={Icons.faFutbol} sport="fotbal" logo="http://bit.ly/32Z7Hfl"/>
                        <CardTemplate nazev="Tým 4" icon={Icons.faHockeyPuck} sport="hokej"
                                      logo="http://bit.ly/32Z7Hfl"/>
                        <CardTemplate nazev="Tým 3" icon={Icons.faFutbol} sport="fotbal" logo="http://bit.ly/32Z7Hfl"/>
                    </Row>

                    <h2 className="mt-4">Soutěže</h2>
                    <Row>
                        <CardTemplate nazev="Jarov Liga" pozice="Pozice: 1." icon={Icons.faFutbol} sport="fotbal"
                                      logo="http://bit.ly/32Z7Hfl" stav="Probíhá"/>
                        <CardTemplate nazev="Extraliga" pozice="Pozice: 2." icon={Icons.faFutbol} sport="fotbal"
                                      logo="http://bit.ly/2PrDmSC" stav="Ukončena"/>
                    </Row>

                    <Modal show={show} onHide={handleClose}>
                        <Formik
                            validationSchema={schemaChangePassword}
                            initialValues={{
                                oldPassword: '',
                                newPassword1: '',
                                newPassword2: ''
                            }}
                            onSubmit={values => {
                                const { oldPassword, newPassword1, newPassword2 } = values;
                                ChangePassword(api, user.id_user, oldPassword, newPassword1, newPassword2);
                                setShow(false);
                            }}
                        >{({  handleSubmit, handleChange, errors  }) => (
                            <Form noValidate onSubmit={handleSubmit}>
                                <Modal.Body>
                                    <Form.Group controlId="oldPassword">
                                        <Form.Label>Stávající heslo</Form.Label>
                                        <Form.Control type="password"
                                                      name="oldPassword"
                                                      onChange={handleChange}
                                                      isInvalid={!!errors.oldPassword}/>
                                        <Form.Control.Feedback type="invalid">
                                            Vyplňte prosím Vaše stávající heslo
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                    <Form.Group controlId="newPassword1">
                                        <Form.Label>Nové heslo</Form.Label>
                                        <Form.Control minLength="6"
                                                      type="password"
                                                      name="newPassword1"
                                                      onChange={handleChange}
                                                      isInvalid={!!errors.newPassword1}/>
                                        <Form.Control.Feedback type="invalid">
                                            Heslo musí obsahovat alespoň 6 znaků a alespoň 1 velké písmeno, 1 malé písmeno a 1 číslo.
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                    <Form.Group controlId="newPassword2">
                                        <Form.Label>Potvrzení hesla</Form.Label>
                                        <Form.Control type="password"
                                                      name="newPassword2"
                                                      onChange={handleChange}
                                                      isInvalid={!!errors.newPassword2}/>
                                        <Form.Control.Feedback type="newPassword2">
                                            Hesla se musí shodovat
                                        </Form.Control.Feedback>
                                    </Form.Group>

                                </Modal.Body>

                                <Modal.Footer>
                                    <Button variant="secondary" type="button" onClick={handleClose}>
                                        Close
                                    </Button>
                                    <Button variant="primary" type="submit">
                                        Změnit heslo
                                    </Button>
                                </Modal.Footer>
                            </Form>
                            )}
                        </Formik>
                    </Modal>
                </div>
                }
            </MainSection>
            <Footer/>
        </div>
    );
}
