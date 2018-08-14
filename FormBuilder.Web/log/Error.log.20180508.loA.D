2018-05-08 10:21:47,016 [9] ERROR FormBuilder.Web.Areas.FormBuilder.Controllers.DataModelController - System.Data.SqlClient.SqlException (0x80131904): 在与 SQL Server 建立连接时出现与网络相关的或特定于实例的错误。未找到或无法访问服务器。请验证实例名称是否正确并且 SQL Server 已配置为允许远程连接。 (provider: SQL Network Interfaces, error: 26 - 定位指定的服务器/实例时出错)
   在 System.Data.ProviderBase.DbConnectionPool.TryGetConnection(DbConnection owningObject, UInt32 waitForMultipleObjectsTimeout, Boolean allowCreate, Boolean onlyOneCheckConnection, DbConnectionOptions userOptions, DbConnectionInternal& connection)
   在 System.Data.ProviderBase.DbConnectionPool.TryGetConnection(DbConnection owningObject, TaskCompletionSource`1 retry, DbConnectionOptions userOptions, DbConnectionInternal& connection)
   在 System.Data.ProviderBase.DbConnectionFactory.TryGetConnection(DbConnection owningConnection, TaskCompletionSource`1 retry, DbConnectionOptions userOptions, DbConnectionInternal oldConnection, DbConnectionInternal& connection)
   在 System.Data.ProviderBase.DbConnectionInternal.TryOpenConnectionInternal(DbConnection outerConnection, DbConnectionFactory connectionFactory, TaskCompletionSource`1 retry, DbConnectionOptions userOptions)
   在 System.Data.SqlClient.SqlConnection.TryOpenInner(TaskCompletionSource`1 retry)
   在 System.Data.SqlClient.SqlConnection.TryOpen(TaskCompletionSource`1 retry)
   在 System.Data.SqlClient.SqlConnection.Open()
   在 NPoco.Database.OpenSharedConnectionImp(Boolean isInternal)
   在 NPoco.Database.<QueryImp>d__156`1.MoveNext()
   在 System.Collections.Generic.List`1..ctor(IEnumerable`1 collection)
   在 System.Linq.Enumerable.ToList[TSource](IEnumerable`1 source)
   在 FormBuilder.Service.FBFileService.getFileList(String dataID, String frmID, String field) 位置 F:\Project\FormBuilder\Com.FormBuilder\FromBuilder.Service\CustomForm\FBFileService.cs:行号 47
   在 FormBuilder.Web.Areas.FormBuilder.Controllers.FileController.GetFileList(String dataID, String frmID, String field) 位置 F:\Project\FormBuilder\Com.FormBuilder\FormBuilder.Web\Areas\FormBuilder\Controllers\FileController.cs:行号 90
ClientConnectionId:00000000-0000-0000-0000-000000000000
Error Number:-1,State:0,Class:20
2018-05-08 23:26:31,692 [23] ERROR FormBuilder.Web.Areas.FormBuilder.Controllers.DataModelController - System.NotImplementedException: 未实现该方法或操作。
   在 FormBuilder.Service.FBFileService.saveFile(FBFileSave model, Byte[] data) 位置 F:\Project\FormBuilder\Com.FormBuilder\FromBuilder.Service\CustomForm\FBFileService.cs:行号 70
   在 FormBuilder.Web.Areas.FormBuilder.Controllers.FileController.Upload(String dataID, String frmID, String field) 位置 F:\Project\FormBuilder\Com.FormBuilder\FormBuilder.Web\Areas\FormBuilder\Controllers\FileController.cs:行号 60
2018-05-08 23:26:58,308 [7] ERROR FormBuilder.Web.Areas.FormBuilder.Controllers.DataModelController - System.NotImplementedException: 未实现该方法或操作。
   在 FormBuilder.Service.FBFileService.saveFile(FBFileSave model, Byte[] data) 位置 F:\Project\FormBuilder\Com.FormBuilder\FromBuilder.Service\CustomForm\FBFileService.cs:行号 70
   在 FormBuilder.Web.Areas.FormBuilder.Controllers.FileController.Upload(String dataID, String frmID, String field) 位置 F:\Project\FormBuilder\Com.FormBuilder\FormBuilder.Web\Areas\FormBuilder\Controllers\FileController.cs:行号 60
2018-05-08 23:26:59,625 [22] ERROR FormBuilder.Web.Areas.FormBuilder.Controllers.DataModelController - System.NotImplementedException: 未实现该方法或操作。
   在 FormBuilder.Service.FBFileService.saveFile(FBFileSave model, Byte[] data) 位置 F:\Project\FormBuilder\Com.FormBuilder\FromBuilder.Service\CustomForm\FBFileService.cs:行号 70
   在 FormBuilder.Web.Areas.FormBuilder.Controllers.FileController.Upload(String dataID, String frmID, String field) 位置 F:\Project\FormBuilder\Com.FormBuilder\FormBuilder.Web\Areas\FormBuilder\Controllers\FileController.cs:行号 60
2018-05-08 23:35:35,027 [34] ERROR FormBuilder.Web.Areas.FormBuilder.Controllers.DataModelController - System.NotImplementedException: 未实现该方法或操作。
   在 FormBuilder.Service.FBFileService.saveFile(FBFileSave model, Byte[] data) 位置 F:\Project\FormBuilder\Com.FormBuilder\FromBuilder.Service\CustomForm\FBFileService.cs:行号 70
   在 FormBuilder.Web.Areas.FormBuilder.Controllers.FileController.Upload(String dataID, String frmID, String field) 位置 F:\Project\FormBuilder\Com.FormBuilder\FormBuilder.Web\Areas\FormBuilder\Controllers\FileController.cs:行号 60
2018-05-08 23:37:02,954 [40] ERROR FormBuilder.Web.Areas.FormBuilder.Controllers.DataModelController - System.NotImplementedException: 未实现该方法或操作。
   在 FormBuilder.Service.FBFileService.saveFile(FBFileSave model, Byte[] data) 位置 F:\Project\FormBuilder\Com.FormBuilder\FromBuilder.Service\CustomForm\FBFileService.cs:行号 70
   在 FormBuilder.Web.Areas.FormBuilder.Controllers.FileController.Upload(String dataID, String frmID, String field) 位置 F:\Project\FormBuilder\Com.FormBuilder\FormBuilder.Web\Areas\FormBuilder\Controllers\FileController.cs:行号 60
