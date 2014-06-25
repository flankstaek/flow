
var   path = require('path')

exports.bake = function bake(flow, build_config) {

    var project = flow.project.prepared;

    console.log('\nflow / bake - project %s\n', flow.project.parsed.name);

    flow.project.hxml = exports.hxml(flow, project, build_config );

    console.log(flow.project.hxml);
    console.log('');

    flow.project.baked = true;

} //project

    //bakes defines into a usable form
exports.defines = function defines(flow, project, build_config, split) {

    split = split || '\n';

    var list = project.defines_list.map(function(a){
        return '-D ' + a;
    });

    return list.join(split) + split;

} //defines

    //bakes flags into a usable form
exports.flags = function flags(flow, project, build_config, split) {

    split = split || '\n';

    return project.flags.join(split) + split;

} //flags


exports.target = function(flow, project, build_config, split) {

    split = split || '\n';

    var values = '-cp haxe/';

    switch(flow.target) {

        case 'mac': case 'linux': case 'windows':
        case 'android': case 'ios': {
            values += split + '-cpp cpp/';
            break;
        } //native

        case 'web':{
                //js the file can go straight out to the dest path
            var out_file = path.join(flow.project.path_output, project.source.product.app+'.js');
            var abs_out_path = path.join(flow.run_path, flow.project.path_build);
            out_file = path.relative(abs_out_path, out_file);

            values += split + '-js ' + out_file;
            break;
        } //web

    } //switch

    return values;

} //target

    //bakes the whole project into a usable complete hxml
exports.hxml = function(flow, project, build_config, with_compile, split) {

    split = split || '\n';

    var hxml_ = '-main ' + flow.config.build.app_boot + split;

    hxml_ += exports.defines(flow, project, build_config, split);
    hxml_ += exports.flags(flow, project, build_config, split);
    hxml_ += exports.target(flow, project, build_config, split);

        //since we want to manually invoke the builds
        //with custom configs we tell haxe only to generate
        //the files, not invoke the post generate compiler (i.e hxcpp for cpp, etc)
    if(!with_compile) {
        hxml_ += split + '-D no-compilation';
    }

    return hxml_;

} //hxml