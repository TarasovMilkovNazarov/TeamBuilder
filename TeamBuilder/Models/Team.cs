﻿using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using TeamBuilder.Controllers.Paging;
using TeamBuilder.Models.Enums;

namespace TeamBuilder.Models
{
	public class Team : IHasId
	{
		public long Id { get; set; }
		public string Name { get; set; }
		public string Description { get; set; }
		public string Link { get; set; }

		[ForeignKey(nameof(ImageId))]
		public Image Image { get; set; }
		public long? ImageId { get; set; }

		public int NumberRequiredMembers { get; set; }
		public string DescriptionRequiredMembers { get; set; }
		[ForeignKey(nameof(EventId))]
		public Event Event { get; set; }
		public long? EventId { get; set; }
		public List<UserTeam> UserTeams { get; set; }
	}

	public class UserTeamDto : IHasId
	{
		public long Id { get; set; }
		public string Name { get; set; }
		public string Description { get; set; }
		public string Link { get; set; }
		public int NumberRequiredMembers { get; set; }
		public string DescriptionRequiredMembers { get; set; }
		public Event Event { get; set; }
		public bool IsOwner { get; set; }
		public UserActionEnum UserAction { get; set; }
	}
}
