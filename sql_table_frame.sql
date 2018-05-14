
/*==============================================================*/
/* Table: FBMenuInfo                                            */
/*==============================================================*/
create table FBMenuInfo 
(
   ID                   varchar(50)                    not null,
   Code                 varchar(50)                    null,
   Name                 varchar(100)                   null,
   Path                 varchar(50)                    null,
   Layer                varchar(50)                    null,
   IsDetail             char(1)                        null,
   PID                  varchar(50)                    null,
   URL                  varchar(2000)                  null,
   ICON                 varchar(50)                    null,
   AppCode              varchar(50)                    null,
   FormID               varchar(50)                    null,
   ShowType             char(1)                        null default '1',
   Ord                  varchar(50)                    null,
   Note                 varchar(2000)                  null,
   constraint PK_FBMENUINFO primary key clustered (ID)
)
GO
/*==============================================================*/
/* Table: FBMenuBtn                                             */
/*==============================================================*/
create table FBMenuBtn 
(
   ID                   varchar(50)                    not null,
   MenuID               varchar(50)                    null,
   Name                 varchar(50)                    null,
   Code                 varchar(50)                    null,
   constraint PK_FBMENUBTN primary key clustered (ID)
)
GO
