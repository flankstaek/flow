var  cmd = require('../../util/process')
     util = require('../../util/util')
   , path = require('path')

exports.launch = function(flow) {

    var abs_outpath = path.resolve(flow.run_path, flow.project.paths.output);

    var port = flow.config.build.web.port;
    var node = flow.bin_path;
    var server_path = path.join( flow.flow_path, 'tools/http-server/http-server');

    flow.log(2, 'launch at http://localhost:%d', port);

    setTimeout(function(){
        util.openurl(flow, 'http://localhost:' + port);
    }, flow.config.build.web.open_delay);

    cmd.exec(flow, node, [server_path, "-c-1", "-p", port], { cwd: abs_outpath });

} //launch