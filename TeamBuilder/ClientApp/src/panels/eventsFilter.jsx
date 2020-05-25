﻿import React, { useState, useEffect } from 'react';
import debounce from 'lodash.debounce';
import {
    Panel, PanelHeader, Search, RichCell, PullToRefresh,
    PanelHeaderButton, CardGrid, Card, PanelHeaderBack
} from '@vkontakte/vkui';
import InfiniteScroll from 'react-infinite-scroller';
import { Api } from '../infrastructure/api';

const EventsFilter = props => {
    const [fetching, setFetching] = useState(false);
    const [hasMoreItems, setHasMoreItems] = useState(true);
    const [nextHref, setNextHref] = useState(null);
    const [events, setEvents] = useState([]);

    const debouncedSearchTerm = useDebounce(searchTerm, 500);
    const [isSearching, setIsSearching] = useState(false);
    const [items, setItems] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    //#region Search

    useEffect(
        () => {
            if (debouncedSearchTerm) {

                console.log("search if")
                setIsSearching(true);
                Api.Events.pagingSearch(debouncedSearchTerm)
                    .then(result => {
                        setItems(result.collection);
                        setNextHref(result.nextHref);
                        setHasMoreItems(result.nextHref ? true : false);
                        setIsSearching(false);
                    });
            }
            else {
                console.log("search else")

                setIsSearching(true);
                Api.Events.getPage()
                    .then(result => {
                        setItems(result.collection);
                        setNextHref(result.nextHref);
                        setIsSearching(false);
                    })
            }
        },
        [debouncedSearchTerm]
    )

    const onRefresh = () => {
        setFetching(true);
        if (searchTerm) {
            Api.Events.pagingSearch(debouncedSearchTerm)
                .then(result => {
                    setItems(result.collection);
                    setNextHref(result.nextHref);
                    setFetching(false);
                });
        }
        else {
            console.log("refresh")
            Api.Events.getPage()
                .then(result => {
                    setItems(result.collection);
                    setNextHref(result.nextHref);
                    setFetching(false);
                })
        }
    };

    //#endregion

    //const getEvents = () => {
    //    fetch(`${Api.Events.GetPage}`)
    //        .then((resp) => resp.json())
    //        .then(json => setEvents(json.collection))
    //        .catch((error) => console.log(`Error for get events page. Details: ${error}`));
    //}

    const getEvents = () => {
        Api.Events.getPage().then(result => setEvents(result));
    }


    //#region Scroll

    const loadItems = page => {
        var url = `${Api.Events.GetPage}`;
        if (nextHref) {
            url = nextHref;
        }

        console.log(`event.loadItems.url: ${url}`);

        fetch(url)
            .then(resp => resp.json())
            .then(e => {
                var eventsTemp = events;
                e.collection.map((event) => {
                    eventsTemp.push(event);
                });

                if (e.nextHref) {
                    setNextHref(e.nextHref);
                    setEvents(eventsTemp);
                } else {
                    setHasMoreItems(false);
                }
            })
            .catch((error) => console.log(`Error for get events page. Details: ${error}`));
    };

    const loader = <div key={0}>Loading ...</div>;

    const getItems = () => {
        var items = [];
        events && events.map((event, i) => {
            items.push(
                <Card size="l" mode="shadow" key={event.id}>
                    <RichCell
                        bottom={`${Math.floor(Math.random() * (+50 - +0)) + +0} команд`}
                        caption={`${event.startDate} - ${event.startDate}`}
                        onClick={(e) => {
                            console.log('sending e', e)
                            props.setActiveTeamPanel('teams');
                            props.activeModal();
                            props.setEventFilter(event);
                        }}
                        data-event={JSON.stringify(event)}
                        data-from={props.id}>
                        {event.name}
                    </RichCell>
                </Card>
            );
        });

        return items;
    }

    //#endregion

    return (
        <Panel id={props.id}>
            <PanelHeader
                left={<PanelHeaderBack onClick={props.go} data-to={props.back} />}>
                Мероприятия
                </PanelHeader>
            <Search value={search} onChange={onChangeSearch} after={null} />
            <PullToRefresh onRefresh={onRefresh} isFetching={fetching}>
                <InfiniteScroll
                    pageStart={0}
                    loadMore={loadItems}
                    hasMore={hasMoreItems}
                    loader={loader}>
                    <CardGrid style={{ marginBottom: 10 }}>
                        {getItems()}
                    </CardGrid>
                </InfiniteScroll>
            </PullToRefresh>
        </Panel>
    );
};

export default EventsFilter;