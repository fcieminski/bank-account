const Tests = require("../models/test");

class TestController {

    index(_, res) {
        Tests.find((error, tests) => {
            if (error) {
                console.error(error);
            }
            res.send({
                tests,
            });
        });
    }

    createTest(req, res) {
        const { body } = req;
        const testsData = new Tests({
            ...body,
        });

        testsData.save((error) => {
            if (error) {
                console.log(error);
            }
            res.send({
                success: true,
                message: "Post saved successfully!",
            });
        });
    }

    update(req, res) {
        const { body } = req;
        Tests.findById(req.params.id, (error, test) => {
            if (error) {
                res.status(500).send({
                    error,
                });
            }
            test.title = body.title;
            test.content = body.content;
            test.save((error) => {
                if (error) {
                    res.status(500).send({
                        error,
                    });
                } else {
                    res.send({
                        test,
                    });
                }
            });
        });
    }
    
    find(req, res) {
        Tests.findById(req.params.id, (error, test) => {
            if (error) {
                console.error(error);
            }
            res.send({
                test,
            });
        });
    }
}

module.exports = new TestController();
