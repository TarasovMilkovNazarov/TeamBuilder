﻿using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace TeamBuilder.Models
{
	public class UserSkill
	{
		public long UserId { get; set; }
		public User User { get; set; }
		public long SkillId { get; set; }
		public Skill Skill { get; set; }
	}
}
