2017-10-06 15:13:53,904 [19] ERROR FormBuilder.Service.FBDataModelService - 必须声明标量变量 "@"。
System.Data.SqlClient.SqlException (0x80131904): 必须声明标量变量 "@"。
   在 System.Data.SqlClient.SqlConnection.OnError(SqlException exception, Boolean breakConnection, Action`1 wrapCloseInAction)
   在 System.Data.SqlClient.TdsParser.ThrowExceptionAndWarning(TdsParserStateObject stateObj, Boolean callerHasConnectionLock, Boolean asyncClose)
   在 System.Data.SqlClient.TdsParser.TryRun(RunBehavior runBehavior, SqlCommand cmdHandler, SqlDataReader dataStream, BulkCopySimpleResultSet bulkCopyHandler, TdsParserStateObject stateObj, Boolean& dataReady)
   在 System.Data.SqlClient.SqlCommand.RunExecuteNonQueryTds(String methodName, Boolean async, Int32 timeout, Boolean asyncWrite)
   在 System.Data.SqlClient.SqlCommand.InternalExecuteNonQuery(TaskCompletionSource`1 completion, String methodName, Boolean sendToPipe, Int32 timeout, Boolean& usedCache, Boolean asyncWrite, Boolean inRetry)
   在 System.Data.SqlClient.SqlCommand.ExecuteNonQuery()
   在 NPoco.Database.ExecuteNonQueryHelper(DbCommand cmd)
   在 NPoco.Database.Execute(Sql Sql)
   在 FormBuilder.Service.DataModelCom.saveFileList(String modelID, String dataID, DataSet ds, Database Db) 位置 F:\Project\FormBuilder\Com.FormBuilder\FromBuilder.Service\DM.Com\DataModelCom.cs:行号 443
   在 FormBuilder.Service.DataModelCom.saveModelALL(String modelID, String dataID, DataSet ds, String status, Database Db) 位置 F:\Project\FormBuilder\Com.FormBuilder\FromBuilder.Service\DM.Com\DataModelCom.cs:行号 406
   在 FormBuilder.Service.FBDataModelService.saveModelALL(String modelID, String dataID, DataSet ds, String status) 位置 F:\Project\FormBuilder\Com.FormBuilder\FromBuilder.Service\FBDataModelService.cs:行号 640
ClientConnectionId:a23fc1d8-95f2-43dc-8ebf-15a45d054894
Error Number:137,State:2,Class:15
2017-10-06 15:14:33,986 [31] ERROR FormBuilder.Service.FBDataModelService - 必须声明标量变量 "@"。
System.Data.SqlClient.SqlException (0x80131904): 必须声明标量变量 "@"。
   在 System.Data.SqlClient.SqlConnection.OnError(SqlException exception, Boolean breakConnection, Action`1 wrapCloseInAction)
   在 System.Data.SqlClient.TdsParser.ThrowExceptionAndWarning(TdsParserStateObject stateObj, Boolean callerHasConnectionLock, Boolean asyncClose)
   在 System.Data.SqlClient.TdsParser.TryRun(RunBehavior runBehavior, SqlCommand cmdHandler, SqlDataReader dataStream, BulkCopySimpleResultSet bulkCopyHandler, TdsParserStateObject stateObj, Boolean& dataReady)
   在 System.Data.SqlClient.SqlCommand.RunExecuteNonQueryTds(String methodName, Boolean async, Int32 timeout, Boolean asyncWrite)
   在 System.Data.SqlClient.SqlCommand.InternalExecuteNonQuery(TaskCompletionSource`1 completion, String methodName, Boolean sendToPipe, Int32 timeout, Boolean& usedCache, Boolean asyncWrite, Boolean inRetry)
   在 System.Data.SqlClient.SqlCommand.ExecuteNonQuery()
   在 NPoco.Database.ExecuteNonQueryHelper(DbCommand cmd)
   在 NPoco.Database.Execute(Sql Sql)
   在 FormBuilder.Service.DataModelCom.saveFileList(String modelID, String dataID, DataSet ds, Database Db) 位置 F:\Project\FormBuilder\Com.FormBuilder\FromBuilder.Service\DM.Com\DataModelCom.cs:行号 443
   在 FormBuilder.Service.DataModelCom.saveModelALL(String modelID, String dataID, DataSet ds, String status, Database Db) 位置 F:\Project\FormBuilder\Com.FormBuilder\FromBuilder.Service\DM.Com\DataModelCom.cs:行号 406
   在 FormBuilder.Service.FBDataModelService.saveModelALL(String modelID, String dataID, DataSet ds, String status) 位置 F:\Project\FormBuilder\Com.FormBuilder\FromBuilder.Service\FBDataModelService.cs:行号 640
ClientConnectionId:a18d1b4a-cd29-4500-abe4-af9e9841dde5
Error Number:137,State:2,Class:15
