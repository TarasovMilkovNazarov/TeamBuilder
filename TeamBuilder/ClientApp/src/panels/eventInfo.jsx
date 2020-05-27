﻿import React, { useState } from 'react';

import { connect } from 'react-redux';
import { bindActionCreators } from "redux";
import { goBack, setPage } from "../store/router/actions";
import { setEvent } from "../store/events/actions";
import { setTeam, setEventsTeam } from "../store/teams/actions";

import {
    Panel, PanelHeader, Group, SimpleCell, InfoRow, Header, FixedLayout,
    PanelHeaderBack, Cell, List, PanelHeaderContent, PanelHeaderContext
} from '@vkontakte/vkui';
import Icon28EditOutline from '@vkontakte/icons/dist/28/edit_outline';
import Icon16Dropdown from '@vkontakte/icons/dist/16/dropdown';
import { Api } from '../infrastructure/api';

const EventInfo = props => {

    const { goBack, setPage, setEvent, setTeam, setEventsTeam, activeView } = props;
    //Api.Users.getPage().then(x => setEvent(x)) ???
    const [contextOpened, setContextOpened] = useState(false);

    const toggleContext = () => {
        setContextOpened(!contextOpened);
    };

    return (
        <Panel id={props.id}>
            <PanelHeader separator={false} left={<PanelHeaderBack onClick={() => goBack()} />}>
                {props.profile.id === props.event.ownerId ?
                    <PanelHeaderContent
                        aside={<Icon16Dropdown style={{ transform: `rotate(${contextOpened ? '180deg' : '0'})` }} />}
                        onClick={toggleContext}
                    >
                        {props.event && props.event.name}
                    </PanelHeaderContent> :
                    props.event && props.event.name}
            </PanelHeader>
            <PanelHeaderContext opened={contextOpened} onClose={toggleContext}>
                <List>
                    <Cell
                        onClick={() => { setPage('events', 'eventEdit') }}
                    >
                        Редактировать событие
                        </Cell>
                </List>
            </PanelHeaderContext>
            <Group>
                {console.log('props in info ', props)}
                <Header mode="primary">Информация о мероприятии</Header>
                <SimpleCell multiline>
                    <InfoRow header="Название">
                        {props.event && props.event.name}
                    </InfoRow>
                </SimpleCell>
                <SimpleCell>
                    <InfoRow header="Ссылка">
                        {props.event && <a href={props.event.link}>{props.event.link}</a>}
                    </InfoRow>
                </SimpleCell>
                <SimpleCell multiline>
                    <InfoRow header="Описание">
                        {props.event && props.event.description}
                    </InfoRow>
                </SimpleCell>
                <SimpleCell>
                    <InfoRow header="Время проведения">
                        {props.event && props.event.startDate} - {props.event && props.event.finishDate}
                    </InfoRow>
                </SimpleCell>
                Добавить команды
                //TO-DO не забыть setTeam(team); setEventsTeam(team)
            </Group>
        </Panel>
    );
}

const mapStateToProps = (state) => {
    return {
        event: state.event.event,
        profile: state.user.profile,
        activeView: state.router.activeView
    };
};


function mapDispatchToProps(dispatch) {
    return {
        dispatch,
        ...bindActionCreators({ setPage, goBack, setEvent, setTeam, setEventsTeam }, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(EventInfo);
