﻿import React from 'react';
import ReactDOM from 'react-dom';
import {
    Panel, PanelHeader, Group, Cell, Avatar, Search, Button, Div, Input, PanelHeaderBack,
    Tabs, TabsItem, Separator, Checkbox, List, Header, FormLayout, Select, RichCell
} from '@vkontakte/vkui';
import {  } from '@vkontakte/vkui';
import '@vkontakte/vkui/dist/vkui.css';
import '../../src/styles/style.css';
import 'react-bootstrap-typeahead/css/Typeahead.css';
import Icon28PhoneOutline from '@vkontakte/icons/dist/28/phone_outline';
import Icon28ArticleOutline from '@vkontakte/icons/dist/28/article_outline';
import Icon20HomeOutline from '@vkontakte/icons/dist/20/home_outline';
import Icon24Write from '@vkontakte/icons/dist/24/write';
import UserTeams from './userTeams'
import UserSkills from './userSkills'

class User extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            skills: null,
            userSkills: null,
            fetchedUser: props.fetchedUser,
            activeTabProfile: 'main',
            selected: false,
            selectedSkills: null,
            isConfirmed: false,
            goUserEdit: props.goUserEdit,
            goSetUserTeam: props.goSetUserTeam,
            user: null,
            readOnlyMode: props.activeStory != 'user'
        }

        this.confirmUser = this.confirmUser.bind(this);
    }

    componentDidMount() {
        this.isUserConfirmed(this.state.fetchedUser.id);
    }

    isUserConfirmed(vkId) {
        fetch(`/api/user/checkconfirmation?vkId=${vkId}`)
            .then((response) => {
                this.setState({ isConfirmed: response })

                console.log('before user fetch', vkId);

                fetch(`/api/user/get?vkId=${vkId}`)
                    .then(response => response.json())
                    .then(data => this.setState({ user: data }));
            } 
        );

	}

    async confirmUser(vkId) {
        console.log('into confirm user', this.state.user.isSearchable);
        let skillsIds;

        if (this.state.userSkills == null) {
            skillsIds = this.state.user.userSkills.map((s, i) => s.skillId);
        }
		else {
            skillsIds = this.state.userSkills.map((s, i) => s.id);
        }

        var isSearchable = this.state.user.isSearchable;
        var profileViewModel = { vkId, skillsIds, isSearchable };

        let response = await fetch('/api/user/confirm', {
            method: 'post',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(profileViewModel),
        });

        this.setState({ isConfirmed: true });
    }

    handleClick(event, selectedSkills) {
        this.setState({
            userSkills: selectedSkills
        })
        //event.preventDefault();
    };

    handleCheckboxClick(event) {
        console.log('checkbox clicked value', event.target.checked);
        var user = { ...this.state.user }
        user.isSearchable = event.target.checked;
        this.setState({ user });
    };

    render() {
        console.log('render user', this.state.user);
        console.log('render user readOnlyMode', this.props.activeStory != 'user');
        return (
            <Panel id="user">
                <PanelHeader separator={false} left={this.state.readOnlyMode &&
                    <PanelHeaderBack onClick={this.state.goUserEdit}
                    data-to={this.props.return} />}>Профиль</PanelHeader>
                {this.state.fetchedUser &&
                    <Group title="VK Connect">
                        <Cell description={this.state.fetchedUser.city && this.state.fetchedUser.city.title ? this.state.fetchedUser.city.title : ''}
                            before={this.state.fetchedUser.photo_200 ? <Avatar src={this.state.fetchedUser.photo_200} /> : null}>
                            {`${this.state.fetchedUser.first_name} ${this.state.fetchedUser.last_name}`}
                        </Cell>
                    </Group>}
                <Separator />
                <Tabs>
                    <TabsItem
                        onClick={() => this.setState({ activeTabProfile: 'main', showMain: true })}
                        selected={this.state.activeTabProfile === 'main'}>
                        Основное
                        </TabsItem>
                    <TabsItem
                        onClick={() => this.setState({ activeTabProfile: 'teams', showMain: false })}
                        selected={this.state.activeTabProfile === 'teams'}>
                        Команды
                    </TabsItem>
                </Tabs>
                    {
                    this.state.activeTabProfile === 'main' ?
                        <Group header={<Header mode="secondary">Информация о профиле участника</Header>}>
                            <List>
                                {!this.state.readOnlyMode && <Cell asideContent=
                                    {
                                        <Icon24Write onClick={this.state.goUserEdit}
                                            data-to='userEdit'
                                            data-id={this.state.fetchedUser && this.state.fetchedUser.id}
                                            data-user={JSON.stringify(this.state.user)} />
                                    }>
                                </Cell>}
                                <Cell before={<Icon20HomeOutline height={28} width={28} />}>
                                    город: {this.state.user && this.state.user.city}
                                </Cell>
                                <Cell before={<Icon28PhoneOutline />}>
                                    тел.:
                                </Cell>
                                <Cell before={<Icon28ArticleOutline />}>
                                    дополнительно: {this.state.user && this.state.user.about}
                                </Cell>
                            </List>
                            <UserSkills userSkills={this.state.userSkills} readOnlyMode={this.state.readOnlyMode}
                                handleClick={this.handleClick.bind(this, this.state.selectedSkills)}
                                id={this.state.fetchedUser && this.state.fetchedUser.id} />
                        </Group> :
                        <Group>
                            <UserTeams userTeams={this.state.user && this.state.user.userTeams}
                                goUserEdit={this.state.goUserEdit} readOnlyMode={this.state.readOnlyMode} />
                        </Group>
                }
                <Div>
                    <Checkbox disabled={this.state.readOnlyMode} onChange={(e) => this.handleCheckboxClick(e)}
                        checked={this.state.user && this.state.user.isSearchable ? 'checked' : ''}>в поиске команды</Checkbox>
                    {!this.state.readOnlyMode && <Button mode={this.state.isConfirmed ? "primary" : "destructive"} size='xl'
                        onClick={() => this.confirmUser(this.state.fetchedUser && this.state.fetchedUser.id, this.state.userSkills)}>
                        {this.state.isConfirmed ? "Сохранить" : "Подтвердить"}
                    </Button>}
                </Div>
                <Div>
                    <Button mode="primary" size='xl'
                        onClick={ this.state.goSetUserTeam }
                        data-to='setUserTeam'
                        data-user={JSON.stringify(this.state.user)}>
                        Завербовать
                    </Button>
                </Div>
            </Panel>
        )
    }
}

export default User;