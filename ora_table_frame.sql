
/*==============================================================*/
/* Table: 系统菜单表                                            */
/*==============================================================*/



declare v_cnt  number;
begin
select count(*) into v_cnt from user_all_tables where Upper(table_name) =Upper('FBMenuInfo');
if (v_cnt< 1) then
execute immediate('
create table FBMenuInfo 
(
   ID                   varchar(50)                    not null,
   Code                 varchar(50)                    null,
   ShowName             varchar(100)                   null,
   MenuPath             varchar(50)                    null,
   Layer                varchar(50)                    null,
   IsDetail             char(1)                        null,
   PID                  varchar(50)                    null,
   LinkURL              varchar(2000)                  null,
   ICON                 varchar(50)                    null,
   AppCode              varchar(50)                    null,
   FormID               varchar(50)                    null,
   ShowType             char(1)                        null default '1',
   Ord                  varchar(50)                    null,
   Note                 varchar(2000)                  null,
   constraint PK_FBMENUINFO primary key  (ID)
)'); 
end if;
end;
go

/*==============================================================*/
/* Table: FBMenuBtn     系统菜按钮                               */
/*==============================================================*/

declare v_cnt  number;
begin
select count(*) into v_cnt from user_all_tables where Upper(table_name) =Upper('FBMenuBtn');
if (v_cnt< 1) then
execute immediate('
create table FBMenuBtn 
(
   ID                   varchar(50)                    not null,
   MenuID               varchar(50)                    null,
   "Name"                 varchar(50)                    null,
   Code                 varchar(50)                    null,
   constraint PK_FBMENUBTN primary key  (ID)
)'); 
end if;
end;
go

/*==============================================================*/
/* Table: FBMenuBtn     用户信息表                               */
/*==============================================================*/


declare v_cnt  number;
begin
select count(*) into v_cnt from user_all_tables where Upper(table_name) =Upper('FBUserInfo');
if (v_cnt< 1) then
execute immediate('
CREATE TABLE FBUserInfo
  (
  UserID            VARCHAR (50) NOT NULL,
  UserCode       VARCHAR (50),
  UserName       VARCHAR (50),
  Email          VARCHAR (50),
  UserPwd        VARCHAR (50),
  UserSalt       VARCHAR (50),
  OrgID          VARCHAR (50),
  DepartID       VARCHAR (50),
  UserType       VARCHAR (50),
  IDCard         VARCHAR (20),
  Ord            VARCHAR (50),
  TelPhone       VARCHAR (20),
  UserState      CHAR (1),
  Avavtar        VARCHAR (200),
  Note           VARCHAR (200),
  CreateTime     VARCHAR (20),
  CreateUser     VARCHAR (50),
  LastModifyTime VARCHAR (50),
  LastModifyUser VARCHAR (20),
  CONSTRAINT PK_FBUSERINFO PRIMARY KEY (UserID)
  )'); 
end if;
end;
go

/* Table: FBRoleUser用户角色关联*/
declare v_cnt  number;
begin
select count(*) into v_cnt from user_all_tables where Upper(table_name) =Upper('FBRoleUser');
if (v_cnt< 1) then
execute immediate('
CREATE TABLE FBRoleUser
  (
  ID     VARCHAR (50) NOT NULL,
  UserID    VARCHAR (50),
  RoleID VARCHAR (50),
  CONSTRAINT PK_FBROLEUSER PRIMARY KEY (ID)
  )'); 
end if;
end;
go
/* Table: FBRolePos岗位角色关联*/
declare v_cnt  number;
begin
select count(*) into v_cnt from user_all_tables where Upper(table_name) =Upper('FBRolePos');
if (v_cnt< 1) then
execute immediate('
 CREATE TABLE FBRolePos
  (
  RoleID VARCHAR (50) NOT NULL,
  PosID  VARCHAR (50),
  ID     VARCHAR (50) NOT NULL,
  CONSTRAINT PK_FBROLEPOS PRIMARY KEY (ID)
  )'); 
end if;
end;
go




/* Table: FBRole用户角色定义*/
declare v_cnt number;
begin
select count(*) into v_cnt from user_all_tables where Upper(table_name) =Upper('FBRole');
if (v_cnt< 1) then
execute immediate('
CREATE TABLE FBRole
	(
	ID    VARCHAR (50) NOT NULL,
	Code  VARCHAR (50),
	Name  VARCHAR (50),
	Ord   VARCHAR (50),
	Note  VARCHAR (200),
	RoleState CHAR (1),
	CONSTRAINT PK_FBROLE PRIMARY KEY (ID)
	)'); 
end if;
end;
go


INSERT INTO FBUserInfo (UserId, UserCode, UserName, Email, UserPwd, UserSalt, OrgID, DepartID, UserType, IDCard, Ord, TelPhone, UserState, Avavtar, Note, CreateTime, CreateUser, LastModifyTime, LastModifyUser)
VALUES ('admin', 'admin', '超级管理员', 'admin@126.com', 'aaaaaa', NULL, NULL, NULL, '1', '', '', 'admin', '1', NULL, '', NULL, NULL, NULL, NULL)


/* Table: FBRole用户岗位关联*/
declare v_cnt number;
begin
select count(*) into v_cnt from user_all_tables where Upper(table_name) =Upper('FBPosUser');
if (v_cnt< 1) then
execute immediate('
CREATE TABLE FBPosUser
(
	ID    VARCHAR (50) NOT NULL,
	UserID   VARCHAR (50),
	PosID VARCHAR (50),
	CONSTRAINT PK_FBPOSUSER PRIMARY KEY (ID)
)'); 
end if;
end;
go
/* Table: FBRole用户岗位信息*/
declare v_cnt number;
begin
select count(*) into v_cnt from user_all_tables where Upper(table_name) =Upper('FBPos');
if (v_cnt< 1) then
execute immediate('
CREATE TABLE FBPos
(
	ID       VARCHAR (50) NOT NULL,
	Code     VARCHAR (50),
	Name     VARCHAR (50),
	PosType  VARCHAR (50),
	Ord      INT,
	Note     VARCHAR (200),
	PosState    CHAR (1),
	OrgID    VARCHAR (50),
	DepartID VARCHAR (50),
	CONSTRAINT PK_FBPOS PRIMARY KEY (ID)
)'); 
end if;
end;
go

/* Table: FBRole系统组织定义*/
declare v_cnt number;
begin
select count(*) into v_cnt from user_all_tables where Upper(table_name) =Upper('FBOrgInfo');
if (v_cnt< 1) then
execute immediate('
CREATE TABLE FBOrgInfo
(
	ID             VARCHAR (50) NOT NULL,
	Code           VARCHAR (50),
	OrgPath           VARCHAR (50),
	Layer          VARCHAR (50),
	IsDetail       CHAR (1),
	Pid            VARCHAR (50),
	Name           VARCHAR (50),
	OrgType        VARCHAR (50),
	OrgOrd            INT,
	OrgState          CHAR (1),
	Note           VARCHAR (50),
	AuthUser       VARCHAR (50),
	CreateUser     VARCHAR (50),
	CreateTime     VARCHAR (20),
	LastModifyUser VARCHAR (50),
	LastModifyTime VARCHAR (20),
	CONSTRAINT PK_FBORGINFO PRIMARY KEY (ID)
)'); 
end if;
end;
go




/* Table: FBOnlineUser系统在线用户*/

declare v_cnt number;
begin
select count(*) into v_cnt from user_all_tables where Upper(table_name) =Upper('FBOnlineUser');
if (v_cnt< 1) then
execute immediate('
CREATE TABLE FBOnlineUser
(
	ID             VARCHAR (50) NOT NULL,
	UserID            VARCHAR (50),
	LoginIP        VARCHAR (50),
	LoginMachine   VARCHAR (50),
	UserState          CHAR (1),
	CreateTime     VARCHAR (20),
	LastModifyTime VARCHAR (20),
	UserToken      VARCHAR (50),
	DeviceType     VARCHAR (20),
	CONSTRAINT PK_FBONLINEUSER PRIMARY KEY (ID)
)'); 
end if;
end;
go


/* Table: FBLoginLog登录日志*/
declare v_cnt number;
begin
select count(*) into v_cnt from user_all_tables where Upper(table_name) =Upper('FBLoginLog');
if (v_cnt< 1) then
execute immediate('
CREATE TABLE FBLoginLog
(
	ID           VARCHAR (50) NOT NULL,
	UserID          VARCHAR (50),
	LoginIP      VARCHAR (50),
	LoginMachine VARCHAR (50),
	LoginResult  VARCHAR (1000),
	LoginTime    VARCHAR (20),
	CONSTRAINT PK_FBLOGINLOG PRIMARY KEY (ID)
)'); 
end if;
end;
go



/* Table: FBAuthPermission用户授权表*/
declare v_cnt number;
begin
select count(*) into v_cnt from user_all_tables where Upper(table_name) =Upper('FBAuthPermission');
if (v_cnt< 1) then
execute immediate('
CREATE TABLE FBAuthPermission
(
	ID           VARCHAR (50) NOT NULL,
	MasterType   CHAR (1),
	MasterValue  VARCHAR (50),
	AccessType       VARCHAR (20),
	AccessOption VARCHAR (20),
	AccessID     VARCHAR (200),
	CONSTRAINT PK_FBAUTHPERMISSION PRIMARY KEY (ID)
)'); 
end if;
end;
go



