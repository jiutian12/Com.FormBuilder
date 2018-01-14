2017-11-11 14:48:07,248 [3] ERROR FormBuilder.Service.FBDataModelService - Unable to connect to any of the specified MySQL hosts.
MySql.Data.MySqlClient.MySqlException (0x80004005): Unable to connect to any of the specified MySQL hosts.
   在 MySql.Data.MySqlClient.NativeDriver.Open()
   在 MySql.Data.MySqlClient.Driver.Open()
   在 MySql.Data.MySqlClient.Driver.Create(MySqlConnectionStringBuilder settings)
   在 MySql.Data.MySqlClient.MySqlPool.GetPooledConnection()
   在 MySql.Data.MySqlClient.MySqlPool.TryToGetDriver()
   在 MySql.Data.MySqlClient.MySqlPool.GetConnection()
   在 MySql.Data.MySqlClient.MySqlConnection.Open()
   在 NPoco.Database.OpenSharedConnectionImp(Boolean isInternal)
   在 NPoco.Database.BeginTransaction(IsolationLevel isolationLevel)
   在 FormBuilder.Service.FBDataModelService.saveModel(String modelID, DataSet ds, String status, TreeNode tree) 位置 F:\Project\FormBuilder\Com.FormBuilder\FromBuilder.Service\FBDataModelService.cs:行号 744
