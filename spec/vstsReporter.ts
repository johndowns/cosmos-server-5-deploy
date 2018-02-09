import TfsReporter = require("jasmine-tfs-reporter");

var reporter = new TfsReporter();
jasmine.getEnv().addReporter(reporter);
