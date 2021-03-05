﻿using System;

namespace Domain
{
    public class ActivityAttendee
    {
        public string AppUserId { get; set; }
        public Guid ActivityGuid { get; set; }
        public Activity Activity { get; set; }
        public AppUser AppUser { get; set; }
        public bool IsHost { get; set; }

        
    }
}
