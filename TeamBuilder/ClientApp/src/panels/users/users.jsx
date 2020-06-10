import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from "redux";
import useDebounce from '../../infrastructure/use-debounce';
import {
    Panel, PanelHeader, Avatar, Search, PanelSpinner, RichCell, PullToRefresh,
    CardGrid, Card
} from '@vkontakte/vkui';
import InfiniteScroll from 'react-infinite-scroller';
import Icon24Work from '@vkontakte/icons/dist/24/work';
import { Api, Urls } from '../../infrastructure/api';

import { setUser, setParticipantUser } from "../../store/user/actions";
import { setPage } from '../../store/router/actions';

const Users = props => {
    const { setParticipantUser, setUser, setPage } = props;
    
    const [isSearching, setIsSearching] = useState(false);
    const [fetching, setFetching] = useState(false);

    const [hasMoreItems, setHasMoreItems] = useState(true);
    const [nextHref, setNextHref] = useState(null);

    const [items, setItems] = useState([]);

    const [searchTerm, setSearchTerm] = useState('');
    const debouncedSearchTerm = useDebounce(searchTerm, 500);

    useEffect(
        () => {
            setIsSearching(true);
            Api.Users.pagingSearch(debouncedSearchTerm)
                .then(result => {
                    setItems(result.collection);
                    setNextHref(result.nextHref);
                    setHasMoreItems(result.nextHref ? true : false);
                    setIsSearching(false);
                });
        },
        [debouncedSearchTerm]
    )

    //#region Search

    const onRefresh = () => {
        setFetching(true);
        if (searchTerm) {
            Api.Users.pagingSearch(debouncedSearchTerm)
                .then(result => {
                    setItems(result.collection);
                    setNextHref(result.nextHref);
                    setHasMoreItems(result.nextHref ? true : false);
                    setFetching(false);
                });
        }
        else {
            Api.Users.getPage()
                .then(result => {
                    setItems(result.collection);
                    setNextHref(result.nextHref);
                    setHasMoreItems(result.nextHref ? true : false);
                    setFetching(false);
                })
        }
    };

    //#endregion

    //#region Scroll

    const loadItems = page => {
        var url = `${Urls.Users.GetPage}`;
        if (nextHref) {
            url = nextHref;
        }
        Api.get(url)
            .then(e => {
                var itemsTemp = items;
                e.collection.map((item) => {
                    itemsTemp.push(item);
                });
                if (e.nextHref) {
                    setNextHref(e.nextHref);
                    setItems(itemsTemp);
                } else {
                    setHasMoreItems(false);
                }
            });
    };

    const loader = <PanelSpinner key={0} size="large" />

    const stringfySkills = (skills) => {
        var joined = skills && skills.map(s => s.name).join(", ");
        var max = 30;
        var result = joined.length > max ? `${joined.substring(0, max)}...` : joined;
        return result;
    }

    //#endregion

    return (
        <Panel id={props.id}>
            <PanelHeader separator={false}>Участники</PanelHeader>
            <Search value={searchTerm} onChange={e => setSearchTerm(e.target.value)} after={null} />
            <PullToRefresh onRefresh={onRefresh} isFetching={fetching}>
                {isSearching ? loader :
                    <InfiniteScroll
                        pageStart={0}
                        loadMore={loadItems}
                        hasMore={hasMoreItems}
                        loader={loader}>
                        <CardGrid style={{ marginBottom: 10 }}>
                            {items && items.map(user => (
                                <Card size="l" mode="shadow" key={user.id}>
                                    {user.isSearchable &&
                                        <RichCell
                                            before={<Avatar size={48} src={user.photo100} />}
                                            after={user.isTeamMember && <Icon24Work />}
                                            caption={user.city && user.city}
                                            bottom={stringfySkills(user.skills)}
                                            text={user.about && user.about}
                                            onClick={() => {
                                                setUser(user);
                                                setParticipantUser(user);
                                                setPage('users', 'user');
                                            }}
                                        >
                                            {user.firstName} {user.lastName}
                                        </RichCell>}
                                </Card>
                            ))}
                        </CardGrid>
                    </InfiniteScroll>}
            </PullToRefresh>
        </Panel>
    );
};

const mapStateToProps = (state) => {
    return {
        profileUser: state.user.profileUser
    }
};

function mapDispatchToProps(dispatch) {
    return {
        dispatch,
        ...bindActionCreators({ setPage, setUser, setParticipantUser }, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Users);