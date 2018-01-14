2017-11-10 10:43:12,125 [28] ERROR FormBuilder.Service.FBDataModelService - Data too long for column 'IsDetail' at row 1
MySql.Data.MySqlClient.MySqlException (0x80004005): Data too long for column 'IsDetail' at row 1
   在 MySql.Data.MySqlClient.MySqlStream.ReadPacket()
   在 MySql.Data.MySqlClient.NativeDriver.GetResult(Int32& affectedRow, Int64& insertedId)
   在 MySql.Data.MySqlClient.Driver.NextResult(Int32 statementId, Boolean force)
   在 MySql.Data.MySqlClient.MySqlDataReader.NextResult()
   在 MySql.Data.MySqlClient.MySqlCommand.ExecuteReader(CommandBehavior behavior)
   在 MySql.Data.MySqlClient.MySqlCommand.ExecuteNonQuery()
   在 NPoco.Database.ExecuteNonQueryHelper(DbCommand cmd)
   在 NPoco.Database.Execute(Sql Sql)
   在 FormBuilder.Service.DataModelCom.saveModel(String modelID, FBDataModel model, DataSet ds, String status, TreeNode treeNode, Database Db) 位置 F:\Project\FormBuilder\Com.FormBuilder\FromBuilder.Service\DM.Com\DataModelCom.cs:行号 504
   在 FormBuilder.Service.FBDataModelService.saveModel(String modelID, DataSet ds, String status, TreeNode tree) 位置 F:\Project\FormBuilder\Com.FormBuilder\FromBuilder.Service\FBDataModelService.cs:行号 746
2017-11-10 11:16:25,425 [3] ERROR FormBuilder.Service.FBDataModelService - Data too long for column 'IsDetail' at row 1
MySql.Data.MySqlClient.MySqlException (0x80004005): Data too long for column 'IsDetail' at row 1
   在 MySql.Data.MySqlClient.MySqlStream.ReadPacket()
   在 MySql.Data.MySqlClient.NativeDriver.GetResult(Int32& affectedRow, Int64& insertedId)
   在 MySql.Data.MySqlClient.Driver.NextResult(Int32 statementId, Boolean force)
   在 MySql.Data.MySqlClient.MySqlDataReader.NextResult()
   在 MySql.Data.MySqlClient.MySqlCommand.ExecuteReader(CommandBehavior behavior)
   在 MySql.Data.MySqlClient.MySqlCommand.ExecuteNonQuery()
   在 NPoco.Database.ExecuteNonQueryHelper(DbCommand cmd)
   在 NPoco.Database.Execute(Sql Sql)
   在 FormBuilder.Service.DataModelCom.saveModel(String modelID, FBDataModel model, DataSet ds, String status, TreeNode treeNode, Database Db) 位置 F:\Project\FormBuilder\Com.FormBuilder\FromBuilder.Service\DM.Com\DataModelCom.cs:行号 504
   在 FormBuilder.Service.FBDataModelService.saveModel(String modelID, DataSet ds, String status, TreeNode tree) 位置 F:\Project\FormBuilder\Com.FormBuilder\FromBuilder.Service\FBDataModelService.cs:行号 746
