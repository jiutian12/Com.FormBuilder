2018-05-21 20:40:07,253 [14] ERROR FormBuilder.Web.Areas.FormBuilder.Controllers.DataModelController - System.NotImplementedException: 未实现该方法或操作。
   在 FormBuilder.Service.FBFileService.saveFile(FBFileSave model, Byte[] data) 位置 F:\Project\FormBuilder\Com.FormBuilder\FromBuilder.Service\CustomForm\FBFileService.cs:行号 70
   在 FormBuilder.Web.Areas.FormBuilder.Controllers.FileController.Upload(String dataID, String frmID, String field, String typecode) 位置 F:\Project\FormBuilder\Com.FormBuilder\FormBuilder.Web\Areas\FormBuilder\Controllers\FileController.cs:行号 61
2018-05-21 20:41:58,032 [8] ERROR FormBuilder.Web.Areas.FormBuilder.Controllers.DataModelController - System.NotImplementedException: 未实现该方法或操作。
   在 FormBuilder.Service.FBFileService.saveFile(FBFileSave model, Byte[] data) 位置 F:\Project\FormBuilder\Com.FormBuilder\FromBuilder.Service\CustomForm\FBFileService.cs:行号 70
   在 FormBuilder.Web.Areas.FormBuilder.Controllers.FileController.Upload(String dataID, String frmID, String field, String typecode) 位置 F:\Project\FormBuilder\Com.FormBuilder\FormBuilder.Web\Areas\FormBuilder\Controllers\FileController.cs:行号 61
2018-05-21 20:48:10,329 [24] ERROR FormBuilder.Web.Areas.FormBuilder.Controllers.DataModelController - System.NotImplementedException: 未实现该方法或操作。
   在 FormBuilder.Service.FBFileService.saveFile(FBFileSave model, Byte[] data) 位置 F:\Project\FormBuilder\Com.FormBuilder\FromBuilder.Service\CustomForm\FBFileService.cs:行号 70
   在 FormBuilder.Web.Areas.FormBuilder.Controllers.FileController.Upload(String dataID, String frmID, String field, String typecode) 位置 F:\Project\FormBuilder\Com.FormBuilder\FormBuilder.Web\Areas\FormBuilder\Controllers\FileController.cs:行号 61
2018-05-21 21:28:36,779 [21] ERROR FormBuilder.Web.Areas.FormBuilder.Controllers.DataModelController - System.Data.SqlClient.SqlException (0x80131904): 列名 'TypeCode' 无效。
   在 System.Data.SqlClient.SqlConnection.OnError(SqlException exception, Boolean breakConnection, Action`1 wrapCloseInAction)
   在 System.Data.SqlClient.TdsParser.ThrowExceptionAndWarning(TdsParserStateObject stateObj, Boolean callerHasConnectionLock, Boolean asyncClose)
   在 System.Data.SqlClient.TdsParser.TryRun(RunBehavior runBehavior, SqlCommand cmdHandler, SqlDataReader dataStream, BulkCopySimpleResultSet bulkCopyHandler, TdsParserStateObject stateObj, Boolean& dataReady)
   在 System.Data.SqlClient.SqlCommand.FinishExecuteReader(SqlDataReader ds, RunBehavior runBehavior, String resetOptionsString, Boolean isInternal, Boolean forDescribeParameterEncryption)
   在 System.Data.SqlClient.SqlCommand.RunExecuteReaderTds(CommandBehavior cmdBehavior, RunBehavior runBehavior, Boolean returnStream, Boolean async, Int32 timeout, Task& task, Boolean asyncWrite, Boolean inRetry, SqlDataReader ds, Boolean describeParameterEncryptionRequest)
   在 System.Data.SqlClient.SqlCommand.RunExecuteReader(CommandBehavior cmdBehavior, RunBehavior runBehavior, Boolean returnStream, String method, TaskCompletionSource`1 completion, Int32 timeout, Task& task, Boolean& usedCache, Boolean asyncWrite, Boolean inRetry)
   在 System.Data.SqlClient.SqlCommand.InternalExecuteNonQuery(TaskCompletionSource`1 completion, String methodName, Boolean sendToPipe, Int32 timeout, Boolean& usedCache, Boolean asyncWrite, Boolean inRetry)
   在 System.Data.SqlClient.SqlCommand.ExecuteNonQuery()
   在 NPoco.Database.ExecuteNonQueryHelper(DbCommand cmd)
   在 NPoco.Database.InsertImp[T](PocoData pocoData, String tableName, String primaryKeyName, Boolean autoIncrement, T poco)
   在 NPoco.Database.Insert[T](String tableName, String primaryKeyName, Boolean autoIncrement, T poco)
   在 NPoco.Database.Save[T](T poco)
   在 FormBuilder.Service.FBFileService.saveFile(FBFileSave model, Byte[] data) 位置 F:\Project\FormBuilder\Com.FormBuilder\FromBuilder.Service\CustomForm\FBFileService.cs:行号 70
   在 FormBuilder.Web.Areas.FormBuilder.Controllers.FileController.Upload(String dataID, String frmID, String field, String typecode) 位置 F:\Project\FormBuilder\Com.FormBuilder\FormBuilder.Web\Areas\FormBuilder\Controllers\FileController.cs:行号 61
ClientConnectionId:b5f9bdbf-2f5b-4acc-ab05-7a6d14b7db4d
Error Number:207,State:1,Class:16
2018-05-21 21:29:15,814 [9] ERROR FormBuilder.Web.Areas.FormBuilder.Controllers.DataModelController - System.Data.SqlClient.SqlException (0x80131904): 列名 'TypeCode' 无效。
   在 System.Data.SqlClient.SqlConnection.OnError(SqlException exception, Boolean breakConnection, Action`1 wrapCloseInAction)
   在 System.Data.SqlClient.TdsParser.ThrowExceptionAndWarning(TdsParserStateObject stateObj, Boolean callerHasConnectionLock, Boolean asyncClose)
   在 System.Data.SqlClient.TdsParser.TryRun(RunBehavior runBehavior, SqlCommand cmdHandler, SqlDataReader dataStream, BulkCopySimpleResultSet bulkCopyHandler, TdsParserStateObject stateObj, Boolean& dataReady)
   在 System.Data.SqlClient.SqlCommand.FinishExecuteReader(SqlDataReader ds, RunBehavior runBehavior, String resetOptionsString, Boolean isInternal, Boolean forDescribeParameterEncryption)
   在 System.Data.SqlClient.SqlCommand.RunExecuteReaderTds(CommandBehavior cmdBehavior, RunBehavior runBehavior, Boolean returnStream, Boolean async, Int32 timeout, Task& task, Boolean asyncWrite, Boolean inRetry, SqlDataReader ds, Boolean describeParameterEncryptionRequest)
   在 System.Data.SqlClient.SqlCommand.RunExecuteReader(CommandBehavior cmdBehavior, RunBehavior runBehavior, Boolean returnStream, String method, TaskCompletionSource`1 completion, Int32 timeout, Task& task, Boolean& usedCache, Boolean asyncWrite, Boolean inRetry)
   在 System.Data.SqlClient.SqlCommand.InternalExecuteNonQuery(TaskCompletionSource`1 completion, String methodName, Boolean sendToPipe, Int32 timeout, Boolean& usedCache, Boolean asyncWrite, Boolean inRetry)
   在 System.Data.SqlClient.SqlCommand.ExecuteNonQuery()
   在 NPoco.Database.ExecuteNonQueryHelper(DbCommand cmd)
   在 NPoco.Database.InsertImp[T](PocoData pocoData, String tableName, String primaryKeyName, Boolean autoIncrement, T poco)
   在 NPoco.Database.Insert[T](String tableName, String primaryKeyName, Boolean autoIncrement, T poco)
   在 NPoco.Database.Save[T](T poco)
   在 FormBuilder.Service.FBFileService.saveFile(FBFileSave model, Byte[] data) 位置 F:\Project\FormBuilder\Com.FormBuilder\FromBuilder.Service\CustomForm\FBFileService.cs:行号 70
   在 FormBuilder.Web.Areas.FormBuilder.Controllers.FileController.Upload(String dataID, String frmID, String field, String typecode) 位置 F:\Project\FormBuilder\Com.FormBuilder\FormBuilder.Web\Areas\FormBuilder\Controllers\FileController.cs:行号 61
ClientConnectionId:93458561-5354-451f-aa9a-ed1550275767
Error Number:207,State:1,Class:16
