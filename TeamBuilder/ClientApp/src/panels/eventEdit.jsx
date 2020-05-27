﻿import React, { useState } from 'react';

import { connect } from 'react-redux';
import { bindActionCreators } from "redux";
import { goBack, setPage } from "../store/router/actions";
import { setEvent } from "../store/events/actions";

import {
    Panel, PanelHeader, Group, Button, Textarea, FixedLayout,
    PanelHeaderBack, Input, FormLayout
} from '@vkontakte/vkui';
import { Api } from '../infrastructure/api';

const EventEdit = props => {
    const [changedEvent, setChangedEvent] = useState(props.event.name);

    const [eventName, setEventName] = useState(props.event.name);
    const [eventDescription, setEventDescription] = useState(props.event.description);
    const [eventLink, setEventLink] = useState(props.event.link);
    const [eventStartDate, setEventStartDate] = useState(props.event.startDate);
    const [eventFinishDate, setEventFinishDate] = useState(props.event.finishDate);
    const { goBack, setEvent } = props;

    const onNameChange = (e) => {

        setEventName(e.target.value);
    };

    const onDescriptionChange = (e) => {
        setEventDescription(e.target.value);
    };

    const onLinkChange = (e) => {
        setEventLink(e.target.value);
    };

    const onStartDateChange = (e) => {
        setEventStartDate(e.target.value);
    };

    const onFinishDateChange = (e) => {
        setEventFinishDate(e.target.value);
    };

    const eventEdit = () => {
        var editEventViewModel = {
            id: props.event.id,
            name: eventName,
            description: eventDescription,
            link: eventLink,
            startDate: eventStartDate,
            finishDate: eventFinishDate,
            userId: props.owner ? props.owner.id : -1
        }
        Api.Events.edit(editEventViewModel)
            .then(result => {
                setEvent(result);
                console.log(result);
            });
    }

    return (

        <Panel id={props.id}>
            <PanelHeader separator={false} left={<PanelHeaderBack onClick={() => goBack()} />}>
                Редактировать мероприятие
        </PanelHeader>

            <Group>
                <FormLayout>
                    <Input top="Название соревнования" type="text" onChange={onNameChange} defaultValue={eventName} status={this.state.name ? 'valid' : 'error'} placeholder="Введите название соревнований" />
                    <Textarea top="Описание соревнования" onChange={onDescriptionChange} defaultValue={eventDescription} />
                    <Input top="Ссылка на соревнование" type="text" onChange={onLinkChange} defaultValue={eventLink} />
                    <Input top="Дата начала соревнований" type="text" onChange={onStartDateChange} defaultValue={eventStartDate} />
                    <Input top="Дата завершения соревнований" type="text" onChange={onFinishDateChange} defaultValue={eventFinishDate} />
                </FormLayout>
            </Group>
            <FixedLayout vertical="bottom">
                <Button
                    stretched
                    onClick={() => { eventName && eventEdit(); goBack() }}
                    >
                    Сохранить
                </Button>
            </FixedLayout>
        </Panel>
    );
}

const mapStateToProps = (state) => {
    return {
        event: state.event.event,
    };
};

function mapDispatchToProps(dispatch) {
    return {
        dispatch,
        ...bindActionCreators({ setPage, goBack, setEvent }, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(EventEdit);