﻿using NPoco;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FormBuilder.Utilities
{
    public interface ISessionProvider
    {
        void AddCurrent(ISessionKey user);

        ISessionKey Current();

        void EmptyCurrent();

        void EmptyUser(string uid);

        Database GetCurrentDataBase();
        bool IsOverdue();
    }
}
