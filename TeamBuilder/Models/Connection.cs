﻿namespace TeamBuilder.Models
{
	public class Connection
	{
		public Connection(long userId, ConnectStatus connectStatus)
		{
			UserId = userId;
			ConnectStatus = connectStatus;
		}

		public long Id { get; set; }

		public long UserId { get; set; }

		public ConnectStatus ConnectStatus { get; set; }
	}

	public enum ConnectStatus
	{
		Unknown,
		Online,
		Offline
	}
}