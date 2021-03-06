﻿import React from 'react';
import { connect } from 'react-redux';

import { goToPage } from '../../store/router/actions';

import {
	Panel, PanelHeader, RichCell, Placeholder,
	PanelHeaderButton, CardGrid, Card
} from '@vkontakte/vkui';

import Icon56UsersOutline from '@vkontakte/icons/dist/56/users_outline';

import { Api, Urls } from '../../infrastructure/api';
import { renderEventDate, isNoContentResponse } from "../../infrastructure/utils";

import SearchWithInfiniteScroll from '../components/SearchWithInfiniteScroll';

const Events = props => {
	const { goToPage } = props;

	const renderHeader = (
		props.profileUser
			?
			<PanelHeader
				separator={false}
				left={<PanelHeaderButton className="pointer" onClick={() => goToPage('eventCreate')}>Создать</PanelHeaderButton>}>
				События
					</PanelHeader>
			:
			<PanelHeader separator={false}>
				События
					</PanelHeader>
	)

	const renderItems = items => {
		return (
			<CardGrid style={{ marginTop: 10, marginBottom: 10 }}>
				{items?.map(event => (
					<Card size="l" mode="shadow" key={event.id}>
						<RichCell
							bottom={`Участвуют ${event.teams?.length} команд`}
							caption={renderEventDate(event)}
							onClick={() => goToPage('eventInfo', event.id)}>
							{event.name}
						</RichCell>
					</Card>
				))}
			</CardGrid>
		)
	}

	return (
		<Panel id={props.id}>
			<SearchWithInfiniteScroll
				id={props.id}
				pagingSearchHandler={Api.Events.pagingSearch}
				getPageUrl={Urls.Events.PagingSearch}
				header={renderHeader}>
				{renderItems}
			</SearchWithInfiniteScroll>
			{
				isNoContentResponse(props.error) &&
				<Placeholder icon={<Icon56UsersOutline />} header="Список мероприятий пуст">
					Вы можете создать своё мероприятие и<br /> 
					добавить в него свою команду
				</Placeholder>
			}
			{props.snackbar}
		</Panel>
	);
};

const mapStateToProps = (state) => {
	return {
		profileUser: state.user.profileUser,
		error: state.formData.error,
		snackbar: state.formData.snackbar
	}
};

const mapDispatchToProps = {
	goToPage
};

export default connect(mapStateToProps, mapDispatchToProps)(Events);