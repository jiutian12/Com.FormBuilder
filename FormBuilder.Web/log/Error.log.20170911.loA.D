2017-09-11 17:56:27,867 [35] ERROR FormBuilder.Service.FBDataModelService - 'PurExpertSort' 附近有语法错误。
System.Data.SqlClient.SqlException (0x80131904): 'PurExpertSort' 附近有语法错误。
   在 System.Data.SqlClient.SqlConnection.OnError(SqlException exception, Boolean breakConnection, Action`1 wrapCloseInAction)
   在 System.Data.SqlClient.TdsParser.ThrowExceptionAndWarning(TdsParserStateObject stateObj, Boolean callerHasConnectionLock, Boolean asyncClose)
   在 System.Data.SqlClient.TdsParser.TryRun(RunBehavior runBehavior, SqlCommand cmdHandler, SqlDataReader dataStream, BulkCopySimpleResultSet bulkCopyHandler, TdsParserStateObject stateObj, Boolean& dataReady)
   在 System.Data.SqlClient.SqlCommand.RunExecuteNonQueryTds(String methodName, Boolean async, Int32 timeout, Boolean asyncWrite)
   在 System.Data.SqlClient.SqlCommand.InternalExecuteNonQuery(TaskCompletionSource`1 completion, String methodName, Boolean sendToPipe, Int32 timeout, Boolean& usedCache, Boolean asyncWrite, Boolean inRetry)
   在 System.Data.SqlClient.SqlCommand.ExecuteNonQuery()
   在 NPoco.Database.ExecuteNonQueryHelper(DbCommand cmd)
   在 NPoco.Database.Execute(Sql Sql)
   在 FormBuilder.Service.DataModelCom.saveModelALL(String modelID, String dataID, DataSet ds, String status, Database Db) 位置 F:\Project\FormBuilder\Com.FormBuilder\FromBuilder.Service\DM.Com\DataModelCom.cs:行号 274
   在 FormBuilder.Service.FBDataModelService.saveModelALL(String modelID, String dataID, DataSet ds, String status) 位置 F:\Project\FormBuilder\Com.FormBuilder\FromBuilder.Service\FBDataModelService.cs:行号 527
ClientConnectionId:83b3e4ff-e86d-4498-9c70-ff4df1dfe980
Error Number:102,State:1,Class:15
2017-09-11 17:57:07,771 [35] ERROR FormBuilder.Service.FBDataModelService - 'PurExpertSort' 附近有语法错误。
System.Data.SqlClient.SqlException (0x80131904): 'PurExpertSort' 附近有语法错误。
   在 System.Data.SqlClient.SqlConnection.OnError(SqlException exception, Boolean breakConnection, Action`1 wrapCloseInAction)
   在 System.Data.SqlClient.TdsParser.ThrowExceptionAndWarning(TdsParserStateObject stateObj, Boolean callerHasConnectionLock, Boolean asyncClose)
   在 System.Data.SqlClient.TdsParser.TryRun(RunBehavior runBehavior, SqlCommand cmdHandler, SqlDataReader dataStream, BulkCopySimpleResultSet bulkCopyHandler, TdsParserStateObject stateObj, Boolean& dataReady)
   在 System.Data.SqlClient.SqlCommand.RunExecuteNonQueryTds(String methodName, Boolean async, Int32 timeout, Boolean asyncWrite)
   在 System.Data.SqlClient.SqlCommand.InternalExecuteNonQuery(TaskCompletionSource`1 completion, String methodName, Boolean sendToPipe, Int32 timeout, Boolean& usedCache, Boolean asyncWrite, Boolean inRetry)
   在 System.Data.SqlClient.SqlCommand.ExecuteNonQuery()
   在 NPoco.Database.ExecuteNonQueryHelper(DbCommand cmd)
   在 NPoco.Database.Execute(Sql Sql)
   在 FormBuilder.Service.DataModelCom.saveModelALL(String modelID, String dataID, DataSet ds, String status, Database Db) 位置 F:\Project\FormBuilder\Com.FormBuilder\FromBuilder.Service\DM.Com\DataModelCom.cs:行号 274
   在 FormBuilder.Service.FBDataModelService.saveModelALL(String modelID, String dataID, DataSet ds, String status) 位置 F:\Project\FormBuilder\Com.FormBuilder\FromBuilder.Service\FBDataModelService.cs:行号 527
ClientConnectionId:83b3e4ff-e86d-4498-9c70-ff4df1dfe980
Error Number:102,State:1,Class:15
2017-09-11 17:59:13,982 [35] ERROR FormBuilder.Service.FBDataModelService - 列“ID”不属于表 PurExpert。
System.ArgumentException: 列“ID”不属于表 PurExpert。
   在 System.Data.DataRow.GetDataColumn(String columnName)
   在 System.Data.DataRow.get_Item(String columnName)
   在 FormBuilder.Service.DataModelEngine.BuildInsertSql(FBDataModelObjects obj, DataSet ds) 位置 F:\Project\FormBuilder\Com.FormBuilder\FromBuilder.Service\DM.Com\DataModelEngine.cs:行号 118
   在 FormBuilder.Service.DataModelCom.saveModelALL(String modelID, String dataID, DataSet ds, String status, Database Db) 位置 F:\Project\FormBuilder\Com.FormBuilder\FromBuilder.Service\DM.Com\DataModelCom.cs:行号 276
   在 FormBuilder.Service.FBDataModelService.saveModelALL(String modelID, String dataID, DataSet ds, String status) 位置 F:\Project\FormBuilder\Com.FormBuilder\FromBuilder.Service\FBDataModelService.cs:行号 527
2017-09-11 18:00:15,013 [35] ERROR FormBuilder.Service.FBDataModelService - 列“ID”不属于表 PurExpert。
System.ArgumentException: 列“ID”不属于表 PurExpert。
   在 System.Data.DataRow.GetDataColumn(String columnName)
   在 System.Data.DataRow.get_Item(String columnName)
   在 FormBuilder.Service.DataModelEngine.BuildInsertSql(FBDataModelObjects obj, DataSet ds) 位置 F:\Project\FormBuilder\Com.FormBuilder\FromBuilder.Service\DM.Com\DataModelEngine.cs:行号 118
   在 FormBuilder.Service.DataModelCom.saveModelALL(String modelID, String dataID, DataSet ds, String status, Database Db) 位置 F:\Project\FormBuilder\Com.FormBuilder\FromBuilder.Service\DM.Com\DataModelCom.cs:行号 276
   在 FormBuilder.Service.FBDataModelService.saveModelALL(String modelID, String dataID, DataSet ds, String status) 位置 F:\Project\FormBuilder\Com.FormBuilder\FromBuilder.Service\FBDataModelService.cs:行号 527
2017-09-11 19:34:23,951 [37] ERROR FormBuilder.Service.FBDataModelService - 不能将值 NULL 插入列 'ID'，表 'FormBulider.dbo.PurExpertSort'；列不允许有 Null 值。INSERT 失败。
语句已终止。
System.Data.SqlClient.SqlException (0x80131904): 不能将值 NULL 插入列 'ID'，表 'FormBulider.dbo.PurExpertSort'；列不允许有 Null 值。INSERT 失败。
语句已终止。
   在 System.Data.SqlClient.SqlConnection.OnError(SqlException exception, Boolean breakConnection, Action`1 wrapCloseInAction)
   在 System.Data.SqlClient.TdsParser.ThrowExceptionAndWarning(TdsParserStateObject stateObj, Boolean callerHasConnectionLock, Boolean asyncClose)
   在 System.Data.SqlClient.TdsParser.TryRun(RunBehavior runBehavior, SqlCommand cmdHandler, SqlDataReader dataStream, BulkCopySimpleResultSet bulkCopyHandler, TdsParserStateObject stateObj, Boolean& dataReady)
   在 System.Data.SqlClient.SqlCommand.FinishExecuteReader(SqlDataReader ds, RunBehavior runBehavior, String resetOptionsString, Boolean isInternal, Boolean forDescribeParameterEncryption)
   在 System.Data.SqlClient.SqlCommand.RunExecuteReaderTds(CommandBehavior cmdBehavior, RunBehavior runBehavior, Boolean returnStream, Boolean async, Int32 timeout, Task& task, Boolean asyncWrite, Boolean inRetry, SqlDataReader ds, Boolean describeParameterEncryptionRequest)
   在 System.Data.SqlClient.SqlCommand.RunExecuteReader(CommandBehavior cmdBehavior, RunBehavior runBehavior, Boolean returnStream, String method, TaskCompletionSource`1 completion, Int32 timeout, Task& task, Boolean& usedCache, Boolean asyncWrite, Boolean inRetry)
   在 System.Data.SqlClient.SqlCommand.InternalExecuteNonQuery(TaskCompletionSource`1 completion, String methodName, Boolean sendToPipe, Int32 timeout, Boolean& usedCache, Boolean asyncWrite, Boolean inRetry)
   在 System.Data.SqlClient.SqlCommand.ExecuteNonQuery()
   在 NPoco.Database.ExecuteNonQueryHelper(DbCommand cmd)
   在 NPoco.Database.Execute(Sql Sql)
   在 FormBuilder.Service.DataModelCom.saveModelALL(String modelID, String dataID, DataSet ds, String status, Database Db) 位置 F:\Project\FormBuilder\Com.FormBuilder\FromBuilder.Service\DM.Com\DataModelCom.cs:行号 279
   在 FormBuilder.Service.FBDataModelService.saveModelALL(String modelID, String dataID, DataSet ds, String status) 位置 F:\Project\FormBuilder\Com.FormBuilder\FromBuilder.Service\FBDataModelService.cs:行号 527
ClientConnectionId:6c83551d-152f-4cd8-a8d4-9b730c9aa100
Error Number:515,State:2,Class:16
2017-09-11 19:36:10,656 [37] ERROR FormBuilder.Service.FBDataModelService - 不能将值 NULL 插入列 'ID'，表 'FormBulider.dbo.PurExpertSort'；列不允许有 Null 值。INSERT 失败。
语句已终止。
System.Data.SqlClient.SqlException (0x80131904): 不能将值 NULL 插入列 'ID'，表 'FormBulider.dbo.PurExpertSort'；列不允许有 Null 值。INSERT 失败。
语句已终止。
   在 System.Data.SqlClient.SqlConnection.OnError(SqlException exception, Boolean breakConnection, Action`1 wrapCloseInAction)
   在 System.Data.SqlClient.TdsParser.ThrowExceptionAndWarning(TdsParserStateObject stateObj, Boolean callerHasConnectionLock, Boolean asyncClose)
   在 System.Data.SqlClient.TdsParser.TryRun(RunBehavior runBehavior, SqlCommand cmdHandler, SqlDataReader dataStream, BulkCopySimpleResultSet bulkCopyHandler, TdsParserStateObject stateObj, Boolean& dataReady)
   在 System.Data.SqlClient.SqlCommand.FinishExecuteReader(SqlDataReader ds, RunBehavior runBehavior, String resetOptionsString, Boolean isInternal, Boolean forDescribeParameterEncryption)
   在 System.Data.SqlClient.SqlCommand.RunExecuteReaderTds(CommandBehavior cmdBehavior, RunBehavior runBehavior, Boolean returnStream, Boolean async, Int32 timeout, Task& task, Boolean asyncWrite, Boolean inRetry, SqlDataReader ds, Boolean describeParameterEncryptionRequest)
   在 System.Data.SqlClient.SqlCommand.RunExecuteReader(CommandBehavior cmdBehavior, RunBehavior runBehavior, Boolean returnStream, String method, TaskCompletionSource`1 completion, Int32 timeout, Task& task, Boolean& usedCache, Boolean asyncWrite, Boolean inRetry)
   在 System.Data.SqlClient.SqlCommand.InternalExecuteNonQuery(TaskCompletionSource`1 completion, String methodName, Boolean sendToPipe, Int32 timeout, Boolean& usedCache, Boolean asyncWrite, Boolean inRetry)
   在 System.Data.SqlClient.SqlCommand.ExecuteNonQuery()
   在 NPoco.Database.ExecuteNonQueryHelper(DbCommand cmd)
   在 NPoco.Database.Execute(Sql Sql)
   在 FormBuilder.Service.DataModelCom.saveModelALL(String modelID, String dataID, DataSet ds, String status, Database Db) 位置 F:\Project\FormBuilder\Com.FormBuilder\FromBuilder.Service\DM.Com\DataModelCom.cs:行号 279
   在 FormBuilder.Service.FBDataModelService.saveModelALL(String modelID, String dataID, DataSet ds, String status) 位置 F:\Project\FormBuilder\Com.FormBuilder\FromBuilder.Service\FBDataModelService.cs:行号 527
ClientConnectionId:6c83551d-152f-4cd8-a8d4-9b730c9aa100
Error Number:515,State:2,Class:16
2017-09-11 19:36:40,572 [37] ERROR FormBuilder.Service.FBDataModelService - 不能将值 NULL 插入列 'ID'，表 'FormBulider.dbo.PurExpertSort'；列不允许有 Null 值。INSERT 失败。
语句已终止。
System.Data.SqlClient.SqlException (0x80131904): 不能将值 NULL 插入列 'ID'，表 'FormBulider.dbo.PurExpertSort'；列不允许有 Null 值。INSERT 失败。
语句已终止。
   在 System.Data.SqlClient.SqlConnection.OnError(SqlException exception, Boolean breakConnection, Action`1 wrapCloseInAction)
   在 System.Data.SqlClient.TdsParser.ThrowExceptionAndWarning(TdsParserStateObject stateObj, Boolean callerHasConnectionLock, Boolean asyncClose)
   在 System.Data.SqlClient.TdsParser.TryRun(RunBehavior runBehavior, SqlCommand cmdHandler, SqlDataReader dataStream, BulkCopySimpleResultSet bulkCopyHandler, TdsParserStateObject stateObj, Boolean& dataReady)
   在 System.Data.SqlClient.SqlCommand.FinishExecuteReader(SqlDataReader ds, RunBehavior runBehavior, String resetOptionsString, Boolean isInternal, Boolean forDescribeParameterEncryption)
   在 System.Data.SqlClient.SqlCommand.RunExecuteReaderTds(CommandBehavior cmdBehavior, RunBehavior runBehavior, Boolean returnStream, Boolean async, Int32 timeout, Task& task, Boolean asyncWrite, Boolean inRetry, SqlDataReader ds, Boolean describeParameterEncryptionRequest)
   在 System.Data.SqlClient.SqlCommand.RunExecuteReader(CommandBehavior cmdBehavior, RunBehavior runBehavior, Boolean returnStream, String method, TaskCompletionSource`1 completion, Int32 timeout, Task& task, Boolean& usedCache, Boolean asyncWrite, Boolean inRetry)
   在 System.Data.SqlClient.SqlCommand.InternalExecuteNonQuery(TaskCompletionSource`1 completion, String methodName, Boolean sendToPipe, Int32 timeout, Boolean& usedCache, Boolean asyncWrite, Boolean inRetry)
   在 System.Data.SqlClient.SqlCommand.ExecuteNonQuery()
   在 NPoco.Database.ExecuteNonQueryHelper(DbCommand cmd)
   在 NPoco.Database.Execute(Sql Sql)
   在 FormBuilder.Service.DataModelCom.saveModelALL(String modelID, String dataID, DataSet ds, String status, Database Db) 位置 F:\Project\FormBuilder\Com.FormBuilder\FromBuilder.Service\DM.Com\DataModelCom.cs:行号 279
   在 FormBuilder.Service.FBDataModelService.saveModelALL(String modelID, String dataID, DataSet ds, String status) 位置 F:\Project\FormBuilder\Com.FormBuilder\FromBuilder.Service\FBDataModelService.cs:行号 527
ClientConnectionId:6c83551d-152f-4cd8-a8d4-9b730c9aa100
Error Number:515,State:2,Class:16
