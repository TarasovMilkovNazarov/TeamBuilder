﻿using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace TeamBuilder.Models
{
	public class UserSkill
	{
		public long UserId { get; set; }
		[ForeignKey(nameof(UserId))]
		public User User { get; set; }
		public long SkillId { get; set; }
		[ForeignKey(nameof(SkillId))]
		public Skill Skill { get; set; }
	}
}