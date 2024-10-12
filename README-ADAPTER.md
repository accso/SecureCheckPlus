<div align="center">
    <img src="backend/assets/images/SecureCheckPlusLogoHorizontal.png" alt="SecureCheckPlus Logo">
</div>

# Adapter for SecureCheckPlus by Accso

The adapter for SecureCheckPlus by Accso can be integrated into the CI process to send scan reports to the 
SecureCheckPlus by Accso web application.

This readme assumes that you already have SecureCheckPlus by Accso up and running. If not, please, refer to this
[readme](README.md).

## How to Use the Adapter

For using the adapter you generally have to insert two stages into your CI pipeline:

- the first stage uses the default OWASP image to scan the source code of your application and generate a report file,
- the second stage uses the adapter image to upload this image to the SecureCheckPlus application.

The details on how the stages are specified depends on the CI tool. See the folder 
[tool_templates](adapter/tool_templates/README-TOOL-TEMPLATES.md) for example files for various tools.  

The stages are usually placed AFTER the build stage and BEFORE the deployment stage. 
For the latter the order is important since it is generally not advisable to make 
the application available if it does not comply with the security requirements configured in SecureCheckPlus.

### What parameters do I need to specify?
The following parameters must be passed as environment variables:

- `SERVER_URL` - The URL of the SecureCheckPlus by Accso web application include the relative URL `api/analyzer`.
- `REPORT_FILE_NAME` - The name or path of the report file including the file extension.
- `PROJECT_ID` - The ID (not the name!) of the SecureCheckPlus project.
- `API_KEY` - The API generated for the SecureCheckProject.
- `FILE_FORMAT` - The format of the report. This must be `json` for the time being.
- `TOOL_NAME` - The tool used to generate the report. We use `owasp` for the time being.
- `SKIP` - Skips the uploading of the report. If set to `true` the uploading will be skipped and the stage will 
   execute successfully independently of the vulnerability state of your application. Use with care! 

The normal approach is to provide the values for these environment settings as CI tool variables and refrain from
setting them in the pipeline definition code directly. This is especially important for the `API_KEY` which should
protected (that is only be visible on protected branches) and masked (so that the value will be visible in the
logging output of the stage).

**NOTE**: The CI tool variables used in the stage templates have the prefix `SECURECHECKPLUS_` to avoid name
collisions with other CI variables in your pipeline. They are mapped onto the names
listed above in the stage definitions.
