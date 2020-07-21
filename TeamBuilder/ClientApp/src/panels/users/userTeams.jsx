﻿import Icon28CheckCircleOutline from '@vkontakte/icons/dist/28/check_circle_outline';
import Icon28InfoOutline from '@vkontakte/icons/dist/28/info_outline';
import { Button, Card, CardGrid, Group, List, Placeholder, RichCell, PanelSpinner } from '@vkontakte/vkui';
import * as Alerts from "../components/Alerts.js";
import '@vkontakte/vkui/dist/vkui.css';
import React from 'react';
import { connect } from 'react-redux';
import { Api } from '../../infrastructure/api';
import { countMyActiveTeams, countForeignActiveTeams } from '../../infrastructure/utils';
import { goToPage } from '../../store/router/actions';

class UserTeams extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			userTeams: props.userTeams,
			fetching: false,
		}
	}

	componentDidUpdate(prevProps) {
		if (this.props.userTeams !== prevProps.userTeams) {
			this.setState({ userTeams: this.props.userTeams })
		}
	}

	handleJoin(e, teamId) {
		this.commonHandler(e, async () => {
			let updatedUserTeams = await Api.Users.joinTeam(teamId);
			this.setState({ userTeams: updatedUserTeams });
		});
	}

	async handleQuitOrDecline(e, teamId, teamName, alert) {
		let action = async () => {
			let updatedUserTeams = await Api.Users.quitOrDeclineTeam(teamId);
			this.setState({ userTeams: updatedUserTeams });
		}
		this.commonHandler(e, action, (handler) => alert(teamName, handler));
	}

	async handleCancelRequestToTeam(e, teamId, teamName) {
		let action = async () => {
			let updatedUserTeams = await Api.Users.cancelRequestTeam(teamId);
			this.setState({ userTeams: updatedUserTeams });
		}
		let alert = (handler) => Alerts.CanselRequestToTeamPopout(teamName, handler);
		this.commonHandler(e, action, alert);
	}

	commonHandler = async (e, action, alert) => {
		e.stopPropagation();

		let handler = async () => {
			Alerts.BlockScreen();
			await action();
			Alerts.UnblockScreen();
		};

		if (alert) {
			alert(handler);
		}

		await handler();
	}

	updateUserTeams = (userTeams) => {
		this.setState({ userTeams: userTeams })
	};

	buildTeamAction = (userTeam) => {
		if (this.props.readOnlyMode) {
			return;
		}

		if (userTeam.userAction === 5) {
			return (
				<>
					<Button onClick={(e) => this.handleJoin(e, userTeam.teamId)}>Принять</Button>
					<Button onClick={(e) => this.handleQuitOrDecline(e, userTeam.teamId, userTeam.team.name, Alerts.DeclineTeamInvitePopout)}
						mode="secondary">
						Отклонить
						</Button>
				</>
			);
		}

		if (userTeam.userAction === 1 && !userTeam.isOwner) {
			return (
				<Button onClick={(e) => this.handleCancelRequestToTeam(e, userTeam.teamId, userTeam.team.name)} mode="secondary">
					Отозвать заявку
				</Button>
			);
		}

		if (userTeam.userAction === 2 && !userTeam.isOwner) {
			return (
				<Button onClick={(e) => this.handleQuitOrDecline(e, userTeam.teamId, userTeam.team.name, Alerts.LeaveTeamPopout)} mode="secondary">
					Выйти
				</Button>
			);
		}
	}

	render() {
		const { goToPage } = this.props;
		let isTeamsExistsForProfile = countMyActiveTeams(this.state.userTeams) !== 0;
		let isTeamsExistsForUser = countForeignActiveTeams(this.state.userTeams) !== 0;
		const loader = <PanelSpinner key={0} size="large" />

		return (
			this.props.loading ? loader :
				<Group>
					{!isTeamsExistsForProfile && !this.props.readOnlyMode &&
						<Placeholder header="Вступайте в команду">
							Или создайте свою и пригласите других участников. Здесь можно будет принять
							приглашение от команд или отозвать заявку.
							</Placeholder>}
					{!isTeamsExistsForUser && this.props.readOnlyMode &&
						<Placeholder header="Нет команд">
							Пользователь пока не состоит ни в одной из команд. Вы можете отправить ему приглашение, чтобы он присоединился к вам.
							</Placeholder>}
					<List>
						<CardGrid>
							{
								this.state.userTeams?.map(userTeam => {
									if (this.props.readOnlyMode && userTeam.userAction !== 2 && !userTeam.isOwner)
										return;
									return (
										<Card key={userTeam.teamId} size="l" mode="shadow">
											<RichCell key={userTeam.teamId}
												text={userTeam?.team?.description}
												caption={userTeam.team.event?.name}
												after={userTeam.userAction === 2 ? < Icon28CheckCircleOutline /> :
													(userTeam.userAction === 1 && <Icon28InfoOutline />)}
												onClick={() => { goToPage('teamInfo', userTeam.teamId) }}
												actions={this.buildTeamAction(userTeam)}>
												{userTeam.team.name}
											</RichCell>
										</Card>
									)
								})
							}
						</CardGrid>
					</List>
				</Group>
		)
	}

}

const mapDispatchToProps = {
	goToPage
}

export default connect(null, mapDispatchToProps)(UserTeams);
