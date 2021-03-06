import {
	SET_NOTIFICATIONS, SET_AS_READ, SET_CONNECTION, SET_ERRORMESSAGE
} from './actionTypes';

import { renderNotification } from "../../services/renderers";

// const notification = {
// 	id,
// 	dateTimeNotify,
// 	message,
//  renderedMessage,
//  imageUrl,
// 	notifyType, // 0 None, 1 Regular, 2 Destructive, 3 Important, 4 Service
// 	items,
// 	isNew
// }

// const item = {
// 	Placement,
// 	Id,
// 	Text
// }

const initialState = {
	hubConnection: null,
	notifications: [],
	errorMessage: null
};

export const noticeReducer = (state = initialState, action) => {

	switch (action.type) {
		case SET_NOTIFICATIONS: {

			let nots = action.payload.notifications.map(n => {
				return {
					...n,
					renderedMessage: renderNotification(n)
				};
			});

			return {
				...state,
				notifications: [...state.notifications, ...nots]
			};
		}

		case SET_AS_READ: {
			let ids = action.payload.notificationIds;
			let updated = state.notifications.map(n => {
				if (!ids.includes(n.id)) {
					return n;
				}
				return { ...n, isNew: false };
			});

			return {
				...state,
				notifications: updated
			};
		}

		case SET_CONNECTION: {
			return {
				...state,
				hubConnection: action.payload.hubConnection
			};
		}

		case SET_ERRORMESSAGE: {
			return {
				...state,
				errorMessage: action.payload.errorMessage
			};
		}

		default: {
			return state;
		}
	}
};
