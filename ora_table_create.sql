 

/*数据库连接配置*/
declare v_cnt  number;
begin
select count(*) into v_cnt from user_all_tables where Upper(table_name) =Upper('FBDBSetting');
if (v_cnt< 1) then
execute immediate('
	Create Table  FBDBSetting
		(
		ID             VARCHAR (50) NOT NULL,
		Code           VARCHAR (100),
		DBType         VARCHAR (100),
		"Name"           VARCHAR (100),
		IPAddress      VARCHAR (100),
		UserName       VARCHAR (100),
		"PassWord"       VARCHAR (100),
		IsUsed         CHAR (1),
		CreateUser     VARCHAR (50),
		CreateTime     VARCHAR (20),
		LastModifyUser VARCHAR (50),
		LastModifyTime VARCHAR (20),
		"Catalog"        VARCHAR (100),
		PortInfo       VARCHAR (20),
		CONSTRAINT PK_FBDBSETTING PRIMARY KEY (ID)
		)
	'); 
end if;end;
go




/*数据对象表*/

declare v_cnt  number;
begin
select count(*) into v_cnt from user_all_tables where Upper(table_name) =Upper('FBDataObject');
if (v_cnt< 1) then
execute immediate('
	Create Table  FBDataObject
	(
	ID             VARCHAR (50) NOT NULL,
	Code           VARCHAR (50),
	TableName      VARCHAR (100),
	AiasName       VARCHAR (100),
	DataSource     VARCHAR (50),
	Note           VARCHAR (50),
	CreateUser     VARCHAR (50),
	CreateTime     VARCHAR (20),
	LastModifyUser VARCHAR (50),
	LastModifyTime VARCHAR (20),
	CONSTRAINT PK_FBDATAOBJECT PRIMARY KEY (ID)
	)
	'); 
end if;end;
go

/*数据对象列信息*/
declare v_cnt  number;
begin
select count(*) into v_cnt from user_all_tables where Upper(table_name) =Upper('FBDataObjectCols');
if (v_cnt< 1) then
execute immediate('
	Create Table  FBDataObjectCols
	(
	ID           VARCHAR (50) NOT NULL,
	ObjectID     VARCHAR (50),
	Code         VARCHAR (100),
	"Name"         VARCHAR (100),
	DataType     VARCHAR (20),
	"Length"       VARCHAR (20),
	"Decimal"    VARCHAR (20),
	DefaultValue VARCHAR (200),
	IsRequired   CHAR (1),
	IsUninque    CHAR (1),
	IsPrimary    CHAR (1),
	IsSys        CHAR (1),
	Note         VARCHAR (200),
	ord          VARCHAR (50),
	CONSTRAINT PK_FBDATAOBJECTCOLS PRIMARY KEY (ID)
	)
	'); 
end if;end;
go
/*================数据对象End=================*/


/*数据模型主表*/

declare v_cnt  number;
begin
select count(*) into v_cnt from user_all_tables where Upper(table_name) =Upper('FBDataModel');
if (v_cnt< 1) then
execute immediate('
	Create Table  FBDataModel
	(
	ID             VARCHAR (50) NOT NULL,
	Code           VARCHAR (100),
	"Name"           VARCHAR (100),
	DataSource     VARCHAR (20),
	MainObectID    VARCHAR (50),
	PKCOL          VARCHAR (200),
	CreateUser     VARCHAR (50),
	CreateTime     VARCHAR (20),
	LastModifyUser VARCHAR (50),
	LastModifyTime VARCHAR (20),
	EnableCache    CHAR (1),
	DetailSaveMode CHAR (1),
	CONSTRAINT PK_FBDATAMODEL PRIMARY KEY (ID)
	)
	'); 
end if;end;
go



/*数据模型列信息*/
declare v_cnt  number;
begin
select count(*) into v_cnt from user_all_tables where Upper(table_name) =Upper('FBDataModelCols');
if (v_cnt< 1) then
execute immediate('
	Create Table  FBDataModelCols
	(
	ID             VARCHAR (50) NOT NULL,
	ModelID        VARCHAR (50),
	Code           VARCHAR (100),
	Label          VARCHAR (100),
	"Name"           VARCHAR (100),
	DataType       VARCHAR (50),
	"Length"         VARCHAR (50),
	isList         CHAR (1),
	isCard         CHAR (1),
	isReadOnly     CHAR (1),
	isUpdate       CHAR (1),
	isVirtual      CHAR (1),
	VirtualExpress VARCHAR (1000),
	ParentID       VARCHAR (50),
	RelationID     VARCHAR (50),
	isRelated      CHAR (1),
	ModelObjectID  VARCHAR (50),
	isPrimary      CHAR (1),
	"DECIMAL"      VARCHAR (20),
	Ord            VARCHAR (20),
	CONSTRAINT PK_FBDATAMODELCOLS PRIMARY KEY (ID)
	)
	'); 
end if;
end;
go
 
/*数据模型表关联管理*/

declare v_cnt  number;
begin
select count(*) into v_cnt from user_all_tables where Upper(table_name) =Upper('FBDataModelObjects');
if (v_cnt< 1) then
execute immediate('
	Create Table  FBDataModelObjects
	(
	ID        VARCHAR (50) NOT NULL,
	ObjectID  VARCHAR (50),
	Code      VARCHAR (100),
	"Name"    VARCHAR (100),
	"Level"   CHAR (1),
	ParentID  VARCHAR (50),
	isMain    CHAR (1),
	"Filter"  clob,
	Sort      clob,
	ModelID   VARCHAR (50),
	PKCOLName VARCHAR (50),
	Tree      clob,
	Label     VARCHAR (50),
	"Condition" clob,
	isSave    CHAR (1),
	isTimeStamp CHAR (1),
	ChangeFields VARCHAR(2000),
	CONSTRAINT PK_FBDATAMODELOBJECTS PRIMARY KEY (ID)
	)
	'); 
end if;
end;
go


/*数据模型字段关联*/

declare v_cnt  number;
begin
select count(*) into v_cnt from user_all_tables where Upper(table_name) =Upper('FBDataModelRealtions');
if (v_cnt< 1) then
execute immediate('
	Create Table  FBDataModelRealtions
	(
	ID                 VARCHAR (50) NOT NULL,
	ModelID            VARCHAR (50),
	ObjectID           VARCHAR (50),
	ObjectCode         VARCHAR (100),
	ObjectLabel        VARCHAR (100),
	IsMainObject       CHAR (1),
	ModelObjectID      VARCHAR (50),
	"Filter"           VARCHAR (500),
	FilterExt          VARCHAR (500),
	JoinType           CHAR (1),
	ModelObjectCol     VARCHAR (50),
	ModelObjectColCode VARCHAR (50),
	CONSTRAINT PK_FBDATAMODELREALTIONS PRIMARY KEY (ID)
	)
	'); 
end if;
end;
go



 

/*模型删除检查表*/

declare v_cnt  number;
begin
select count(*) into v_cnt from user_all_tables where Upper(table_name) =Upper('FBModelDeleteCheck');
if (v_cnt< 1) then
execute immediate('
	Create Table  FBModelDeleteCheck(
	ID           VARCHAR (50) NOT NULL,
	ModelID      VARCHAR (50),
	ObjectID     VARCHAR (50),
	RelationID   VARCHAR (50),
	TableName    VARCHAR (50),
	RefFilter    VARCHAR (500),
	ExtendFilter VARCHAR (2000),
	DeleteTip    VARCHAR (2000),
	IsUsed       CHAR (1),
	CONSTRAINT PK_FBDeleteCheck PRIMARY KEY (ID)
	)
	'); 
end if;
end;
go


/*模型保存检查表*/
declare v_cnt  number;
begin
select count(*) into v_cnt from user_all_tables where Upper(table_name) =Upper('FBModelModifyCheck');
if (v_cnt< 1) then
execute immediate('
	Create Table  FBModelModifyCheck(
	ID        VARCHAR (50) NOT NULL,
	ObjectID  VARCHAR (50),
	TableName VARCHAR (50),
	Filter    VARCHAR (2000),
	Tips      VARCHAR (2000),
	IsUsed    CHAR (1),
	ModelID   VARCHAR (50),
	CONSTRAINT PK_FBModelModifyCheck PRIMARY KEY (ID)
	)
	'); 
end if;
end;
go

/*模型动作扩展SQL*/
declare v_cnt  number;
begin
select count(*) into v_cnt from user_all_tables where Upper(table_name) =Upper('FBModelSQL');
if (v_cnt< 1) then
execute immediate('
	Create Table  FBModelSQL(
	ID        	VARCHAR (50) NOT NULL,
	ModelID   	VARCHAR (50),
	SQLInfo   	VARCHAR (2000),
	ActionType  VARCHAR (50),
	Tips      VARCHAR (200),
	IsUsed    CHAR (1),
	CONSTRAINT PK_FBModelSQL PRIMARY KEY (ID)
)
	'); 
end if;
end;
go


/*模型事件扩展*/
declare v_cnt  number;
begin
select count(*) into v_cnt from user_all_tables where Upper(table_name) =Upper('FBModelExtend');
if (v_cnt< 1) then
execute immediate('
	Create Table  FBModelExtend
	(
	ID				VARCHAR (50) NOT NULL,
	ModelID			VARCHAR (50),
	"Assembly"        VARCHAR (100),
	ClassName		VARCHAR (100),
	IsUsed			CHAR (1),
	CONSTRAINT PK_FBMODELEXTEND PRIMARY KEY (ID)
	)
	'); 
end if;
end;
go

/*================数据模型End=================*/


/*数据源信息*/

declare v_cnt  number;
begin
select count(*) into v_cnt from user_all_tables where Upper(table_name) =Upper('FBDataSource');
if (v_cnt< 1) then
execute immediate('
	Create Table  FBDataSource
	(
	ID             VARCHAR (50) NOT NULL,
	Code           VARCHAR (50),
	"Name"           VARCHAR (100),
	DsType         CHAR (1),
	DsCode         VARCHAR (50),
	SqlInfo        clob,
	Reflect        VARCHAR (1000),
	RemoteURL      VARCHAR (1000),
	Tree           VARCHAR (1000),
	IsUpdate       CHAR (1),
	CreateTime     VARCHAR (20),
	CreateUser     VARCHAR (50),
	LastModifyTime VARCHAR (20),
	LastModifyUser VARCHAR (50),
	CONSTRAINT PK_FBDATASOURCE PRIMARY KEY (ID)
	)
	'); 
end if;
end;
go
 

/*数据字段信息*/
declare v_cnt  number;
begin
select count(*) into v_cnt from user_all_tables where Upper(table_name) =Upper('FBDataSourceCols');
if (v_cnt< 1) then
execute immediate('
	Create Table  FBDataSourceCols
	(
	ID       VARCHAR (50) NOT NULL,
	DSID     VARCHAR (50),
	Code     VARCHAR (50),
	"Name"     VARCHAR (50),
	DataType CHAR (1),
	CONSTRAINT PK_FBDATASOURCECOLS PRIMARY KEY (ID)
	)
	'); 
end if;
end;
go


/*================SQL业务End=================*/


/*附件信息表*/

declare v_cnt  number;
begin
select count(*) into v_cnt from user_all_tables where Upper(table_name) =Upper('FBFileSave');
if (v_cnt< 1) then
execute immediate('
	Create Table  FBFileSave(
	ID         VARCHAR (50) NOT NULL,
	FileID     VARCHAR (50),
	"FileName"   VARCHAR (200),
	FilePath   VARCHAR (200),
	CreateUser VARCHAR (50),
	CreateTime VARCHAR (20),
	FileExt    VARCHAR (50),
	FrmID      VARCHAR (50),
	DataID     VARCHAR (50),
	Note       VARCHAR (200)
)
	'); 
end if;
end;
go

/*表单定义主表*/

declare v_cnt  number;
begin
select count(*) into v_cnt from user_all_tables where Upper(table_name) =Upper('FBForm');
if (v_cnt< 1) then
execute immediate('
	Create Table  FBForm
	(
	ID             VARCHAR (50) NOT NULL,
	Code           VARCHAR (50),
	"Name"           VARCHAR (50),
	Title          VARCHAR (50),
	"Type"           CHAR (1),
	ModelID        VARCHAR (50),
	BaseController VARCHAR (50),
	Theme          VARCHAR (50),
	CodeEngine     VARCHAR (50),
	HtmlInfo       clob,
	JSInfo         clob,
	CSSInfo        clob,
	LayoutConfig   clob,
	CreateTime     VARCHAR (20),
	CreateUser     VARCHAR (50),
	LastModifyTime VARCHAR (20),
	LastModifyUser VARCHAR (50),
	PageLayout     clob,
	Config         clob,
	DefaultInfo    clob,
	FSMID          VARCHAR (50),
	UserJS         clob,
	Note           VARCHAR (200),
	ExpressInfo    clob,
	CONSTRAINT PK_FBFORM PRIMARY KEY (ID)
	)
	'); 
end if;
end;
go

/*表单引入sql业务*/

declare v_cnt  number;
begin
select count(*) into v_cnt from user_all_tables where Upper(table_name) =Upper('FBFormDS');
if (v_cnt< 1) then
execute immediate('
	Create Table  FBFormDS
	(
	ID         VARCHAR (50) NOT NULL,
	FormID     VARCHAR (50),
	DSID       VARCHAR (50),
	GroupInfo  VARCHAR (50),
	SingleLoad CHAR (1),
	CONSTRAINT PK_FBFORMDS PRIMARY KEY (ID)
	)
	'); 
end if;
end;
go


/*表单工具栏*/
declare v_cnt  number;
begin
select count(*) into v_cnt from user_all_tables where Upper(table_name) =Upper('FBFormToolBar');
if (v_cnt< 1) then
execute immediate('
	Create Table  FBFormToolBar
	(
	ID          VARCHAR (50) NOT NULL,
	FormID      VARCHAR (50),
	IsRoot      CHAR (1),
	BarType     CHAR (1),
	TypeOptions clob,
	Icon        VARCHAR (50),
	Func        clob,
	ParentID    VARCHAR (50),
	Ord         VARCHAR (50),
	IsUsed      CHAR (1),
	IsSys       CHAR (1),
	BizObject   VARCHAR (50),
	"Text"      VARCHAR (50),
	IsFixed     CHAR (1),
	PropName    VARCHAR (50),
	BarID       VARCHAR (50),
	Align       CHAR (1),
	"Action"    VARCHAR (50),
	BtnStyle    CHAR (1),
	CONSTRAINT PK_FBFORMTOOLBAR PRIMARY KEY (ID)
	)
	'); 
end if;
end;
go
 


/*表单绑定依赖字段信息*/

declare v_cnt  number;
begin
select count(*) into v_cnt from user_all_tables where Upper(table_name) =Upper('FBFormRef');
if (v_cnt< 1) then
execute immediate('
	Create Table  FBFormRef(
	ID       VARCHAR (50) NOT NULL,
	FormID   VARCHAR (50),
	ModelID  VARCHAR (50),
	ObjectID VARCHAR (50),
	ColList  VARCHAR (1000),
	DSID     VARCHAR (50),
	RefType  CHAR (1),
	RefValue VARCHAR (500),
	RefID    VARCHAR (50),
	CONSTRAINT PK_FBFormRef PRIMARY KEY (ID)
	)
	'); 
end if;
end;
go

/*表单引入自定义样式和脚本*/

declare v_cnt  number;
begin
select count(*) into v_cnt from user_all_tables where Upper(table_name) =Upper('FBFormLink');
if (v_cnt< 1) then
execute immediate('
	Create Table  FBFormLink(
	ID       VARCHAR (50),
	FormID   VARCHAR (50),
	LinkType CHAR (1),
	LinkURL  VARCHAR (50),
	IsEnable CHAR (1),
	Note     VARCHAR (500),
	IsSys    CHAR (1),
	Ord      VARCHAR (20),
	CONSTRAINT PK_FBFormLink PRIMARY KEY (ID)
	)
	'); 
end if;
end;
go


/*元数据资源表*/

declare v_cnt  number;
begin
select count(*) into v_cnt from user_all_tables where Upper(table_name) =Upper('FBMetaData');
if (v_cnt< 1) then
execute immediate('
	Create Table  FBMetaData
	(
	ID             VARCHAR (50) NOT NULL,
	Code           VARCHAR (100),
	"Name"           VARCHAR (100),
	"Type"           CHAR (1),
	CreateTime     VARCHAR (20),
	CreateUser     VARCHAR (50),
	LastModifyTime VARCHAR (20),
	LastModifyUser VARCHAR (50),
	"State"          CHAR (1),
	ParentID       VARCHAR (50),
	IsFolder       CHAR (1),
	UserID         VARCHAR (50),
	ModuleID       VARCHAR (50),
	CONSTRAINT PK_FBMETADATA PRIMARY KEY (ID)
	)
	'); 
end if;
end;
go

 


/*元数据模块*/

declare v_cnt  number;
begin
select count(*) into v_cnt from user_all_tables where Upper(table_name) =Upper('FBMetaModule');
if (v_cnt< 1) then
execute immediate('
	Create Table  FBMetaModule(
	ID       VARCHAR (50) NOT NULL,
	Code     VARCHAR (50),
	"Name"     VARCHAR (50),
	Ord      VARCHAR (50),
	IsEnable CHAR (1),
	ParentID VARCHAR (50),
	CONSTRAINT PK_FBMetaModule PRIMARY KEY (ID)
	)
	'); 
end if;
end;
go

/*元数据依赖表*/


declare v_cnt  number;
begin
select count(*) into v_cnt from user_all_tables where Upper(table_name) =Upper('FBMetaDependence');
if (v_cnt< 1) then
execute immediate('
	Create Table  FBMetaDependence
	(
	SourceID   VARCHAR (50),
	SourceType CHAR (1),
	TargetID   VARCHAR (50),
	TargetType CHAR (1)
	)
	'); 
end if;
end;
go

/*元数据类型字典*/


declare v_cnt  number;
begin
select count(*) into v_cnt from user_all_tables where Upper(table_name) =Upper('FBMetaType');
if (v_cnt< 1) then
execute immediate('
	Create Table  FBMetaType
	(
	ID   VARCHAR (50) NOT NULL,
	Code VARCHAR (50),
	"Name" VARCHAR (50)
	)
	'); 
end if;
end;
go


/*智能帮助主表*/

declare v_cnt  number;
begin
select count(*) into v_cnt from user_all_tables where Upper(table_name) =Upper('FBSmartHelp');
if (v_cnt< 1) then
execute immediate('
	 CREATE TABLE  FBSmartHelp
	  (
	  ID             VARCHAR (50) NOT NULL,
	  Code           VARCHAR (100),
	  Name           VARCHAR (100),
	  Title          VARCHAR (100),
	  ModelID        VARCHAR (50),
	  Sort           clob,
	  Filter         clob,
	  ViewType       CHAR (1),
	  CreateTime     VARCHAR (20),
	  CreateUser     VARCHAR (50),
	  LastModifyTime VARCHAR (20),
	  LastModifyUser VARCHAR (50),
	  Asyn           CHAR (1),
	  StartLevel     VARCHAR (20),
	  PageOption     VARCHAR (200),
	  IsAuto         CHAR (1),
	  PageSize       VARCHAR (20),
	  AutoCol        CHAR (1),
	  CONSTRAINT PK_FBSMARTHELP PRIMARY KEY (ID)
	  )'); 
end if;
end;
go


   
/*帮助列信息*/

declare v_cnt  number;
begin
select count(*) into v_cnt from user_all_tables where Upper(table_name) =Upper('FBSmartHelpCols');
if (v_cnt< 1) then
execute immediate('
	 Create Table  FBSmartHelpCols
	(
	ID       VARCHAR (50) NOT NULL,
	HelpID   VARCHAR (50),
	ColName  VARCHAR (50),
	ColCode  VARCHAR (50),
	"Level"  VARCHAR (20),
	"Path"     VARCHAR (50),
	isDetail VARCHAR (50),
	ParentID VARCHAR (50),
	Align    CHAR (1),
	Width    VARCHAR (50),
	Format   clob,
	Render   clob,
	Ord      VARCHAR (50),
	Visible  CHAR (1),
	CONSTRAINT PK_FBSMARTHELPCOLS PRIMARY KEY (ID)
	)'); 
end if;
end;
go




/*平台日志表*/

declare v_cnt  number;
begin
select count(*) into v_cnt from user_all_tables where Upper(table_name) =Upper('FBLog');
if (v_cnt< 1) then
execute immediate('
	Create Table  FBLog(
	ID       VARCHAR (50),
	LogLevel CHAR (1),
	LogInfo  VARCHAR (1000),
	OpUser   VARCHAR (50),
	OpTime   VARCHAR (50),
	CONSTRAINT PK_FBLog PRIMARY KEY (ID)
	)'); 
end if;
end;
go







declare v_cnt  number;
begin
select count(*) into v_cnt from user_all_tables where Upper(table_name) =Upper('FBComponent');
if (v_cnt< 1) then
execute immediate('
	CREATE TABLE  FBComponent
	(
	ID             VARCHAR (50) NOT NULL,
	Code           VARCHAR (200),
	"Name"           VARCHAR (200),
	IsStatic       CHAR (1),
	AssemblyName   VARCHAR (50),
	ClassName      VARCHAR (50),
	Note           VARCHAR (200),
	CreateUser     VARCHAR (50),
	CreateTime     VARCHAR (20),
	LastModifyUser VARCHAR (20),
	LastModifyTime VARCHAR (50),
	CONSTRAINT PK_FBComponent PRIMARY KEY (ID)
	)'); 
end if;
end;
go


declare v_cnt  number;
begin
select count(*) into v_cnt from user_all_tables where Upper(table_name) =Upper('FBCMPMethod');
if (v_cnt< 1) then
execute immediate('
	CREATE TABLE  FBCMPMethod
	(
	ID         VARCHAR (50) NOT NULL,
	CMPID      VARCHAR (50),
	MethodName VARCHAR (40),
	ReturnType CHAR (1),
	Note       VARCHAR (200),
	CONSTRAINT PK_FBCMPMethod PRIMARY KEY (ID)
	)'); 
end if;
end;
go

declare v_cnt  number;
begin
select count(*) into v_cnt from user_all_tables where Upper(table_name) =Upper('FBCMPPara');
if (v_cnt< 1) then
execute immediate('
	CREATE TABLE  FBCMPPara
	(
	ID        VARCHAR (50) NOT NULL,
	CMPID     VARCHAR (50),
	MethodID  VARCHAR (50),
	ParamName VARCHAR (50),
	ParamType CHAR (1),
	Ord       VARCHAR (50),
	Note      VARCHAR (200),
	CONSTRAINT PK_FBCMPPara PRIMARY KEY (ID)
	)'); 
end if;
end;
go
 

/*系统参数设置表*/

declare v_cnt  number;
begin
select count(*) into v_cnt from user_all_tables where Upper(table_name) =Upper('FBSettings');
if (v_cnt< 1) then
execute immediate('
	Create Table  FBSettings
	(
	ID				VARCHAR (50) NOT NULL,
	Code			VARCHAR (100),
	"Name"			VARCHAR (100),
	DataType		VARCHAR (20),
	DataValue		VARCHAR (50),
	Note			VARCHAR (100),
	IsClient		CHAR (1),
	IsSys			CHAR (1),
	CONSTRAINT PK_FBSettings PRIMARY KEY (ID)
	)'); 
end if;
end;
go





/*Visio配置表*/

declare v_cnt  number;
begin
select count(*) into v_cnt from user_all_tables where Upper(table_name) =Upper('FBVisioGraph');
if (v_cnt< 1) then
execute immediate('
	Create Table  FBVisioGraph
	(
	ID             VARCHAR (50) NOT NULL,
	Code           VARCHAR (50),
	"Name"         VARCHAR (100),
	GraphConfig    clob,
	GraphXML       clob,
	CONSTRAINT PK_FBVISIOGRAPH PRIMARY KEY (ID)
	)'); 
end if;
end;
go