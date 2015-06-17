var Fraction = require('../src/fractions');
var Expression = require('../src/expressions');

describe("An expression initialized with an alphabetic variable name", function() {
    var x = new Expression("x");

    it("initializes", function() {
        expect(x).toBeDefined();
    });

    it("is initalized with a constant of 0", function() {
        expect(x.constant).toEqual(new Fraction(0, 1));
    });

    it("is initalized with one term", function() {
        expect(x.terms.length).toEqual(1);
    });
});

describe("An expression initialized with a greek letter variable name", function() {
    var lambda = new Expression("lambda");
    lambda = lambda.add(3);
    lambda = lambda.multiply(5);

    it("initializes", function() {
        expect(lambda).toBeDefined();
    });

    it("converts to tex properly", function() {
        expect(lambda.tex()).toEqual("5\\lambda + 15");
    });

    it("converts to string properly, even though it looks weird", function() {
        expect(lambda.print()).toEqual("5lambda + 15");
    });
});

describe("An expression initialized with nothing", function() {
    var x = new Expression();

    it("initializes", function() {
        expect(x).toBeDefined();
    });

    it("is initalized with a constant of 0", function() {
        expect(x.constant).toEqual(new Fraction(0, 1));
    });

    it("is initalized with zero terms", function() {
        expect(x.terms.length).toEqual(0);
    });
});

describe("Expression addition", function() {
    var x = new Expression("x");
    var y = new Expression("y");
    var z = new Expression("z");

    it("should allow adding other expressions", function() {
        var answer = x.add(y);

        expect(answer.print()).toEqual("x + y");
    });

    it("should properly combine the constant of two expressions", function() {
        var newx = x.add(3);                  // x + 3
        var newy = y.add(new Fraction(1, 4)); // y + 1/4
        var answer = newx.add(newy);          // x + 3 + y + 1/4 => x + y + 13/4

        expect(answer.print()).toEqual("x + y + 13/4");
    });

    it("should properly combine the terms of two expressions - linear", function() {
        var expr1 = x.add(y).add(z); // x + y + z
        var expr2 = z.add(y); // z + y

        var answer = expr1.add(expr2); // x + y + z + z + y = x + 2y + 2z

        expect(answer.print()).toEqual("x + 2y + 2z");
    });

    it("should properly combine the terms of two expressions - nonlinear", function() {
        var expr1 = x.multiply(x);               // x^2
        var expr2 = x.multiply(x).add(y).add(2); // x^2 + y + 2

        var answer = expr1.add(expr2); // x^2 + (x^2 + y + 2) = 2x^2 + y + 2

        expect(answer.print()).toEqual("2x^2 + y + 2");
    });

    it("should properly combine the terms of two expressions - crossproducts", function() {
        var expr1 = x.multiply(y); // xy
        var expr2 = y.multiply(x).add(x).add(2); // yx + x + 2

        var answer = expr1.add(expr2); // xy + (yx + x + 2) = 2xy + x + 2

        expect(answer.print()).toEqual("2xy + x + 2");
    });

    it("should properly remove terms when canceled out", function() {
        var expr1 = x.add(y).add(z); // x + y + z
        var expr2 = z.subtract(y); // z - y

        var answer = expr1.add(expr2); // x + y + z + z - y = x + 2z

        expect(answer.print()).toEqual("x + 2z");
    });

    it("should allow adding fractions", function() {
        var answer = x.add(new Fraction(1, 3));

        expect(answer.print()).toEqual("x + 1/3");
    });

    it("should allow adding integers", function() {
        var answer = x.add(3);

        expect(answer.print()).toEqual("x + 3");
    });

    it("should not allow adding floats", function() {
        expect(function(){x.add(0.25)}).toThrow("InvalidArgument");
    });
});

describe("Expression subtraction", function() {
    var x = new Expression("x");
    var y = new Expression("y");
    var z = new Expression("z");

    it("should allow subtracting other expressions", function() {
        var answer = x.subtract(y);

        expect(answer.print()).toEqual("x - y");
    });

    it("should properly combine the constant of two expressions - linear", function() {
        var newx = x.subtract(3);                  // x - 3
        var newy = y.subtract(new Fraction(1, 4)); // y - 1/4

        var answer = newx.subtract(newy);          // x - 3 - y - (-1/4) => x - y - 12/4 + 1/4 => x - y - 11/4

        expect(answer.print()).toEqual("x - y - 11/4")
    });

    it("should properly combine the terms of two expressions - nonlinear", function() {
        var expr1 = x.multiply(x);   // x^2
        var expr2 = x.multiply(x);
        expr2 = expr2.add(y).add(2); // x^2 + y + 2

        var answer = expr1.subtract(expr2); // x^2 - (x^2 + y + 2) = -y - 2

        expect(answer.print()).toEqual("-y - 2");
    });

    it("should properly combine the terms of two expressions - crossproducts", function() {
        var expr1 = x.multiply(y); // xy
        var expr2 = y.multiply(x).add(x).add(2); // yx + x + 2

        var answer = expr1.subtract(expr2); // xy - (yx + x + 2) = -x - 2

        expect(answer.print()).toEqual("-x - 2");
    });

    it("should properly remove terms when canceled out", function() {
        var expr1 = x.subtract(y).subtract(z); // x - y - z
        var expr2 = z.subtract(y);             // z - y

        var answer = expr1.subtract(expr2);    // x - y - z - (z - y) = x - 2z

        expect(answer.print()).toEqual("x - 2z");
    });

    it("should allow subtracting fractions", function() {
        var answer = x.subtract(new Fraction(1, 3));

        expect(answer.print()).toEqual("x - 1/3");
    });

    it("should allow subtracting integers", function() {
        var answer = x.subtract(3);

        expect(answer.print()).toEqual("x - 3");
    });

    it("should not allow subtracting floats", function() {
        expect(function(){x.subtract(0.25)}).toThrow("InvalidArgument");
    });
});

describe("Expression multiplication", function() {
    var x = new Expression("x");
    var y = new Expression("y");

    it("should allow multiplying by a fraction", function() {
        var answer = x.multiply(new Fraction(1, 3));

        expect(answer.print()).toEqual("1/3x");
    });

    it("should allow multiplying by an integer", function() {
        var answer = x.multiply(5);

        expect(answer.print()).toEqual("5x");
    });

    it("should allow multiplying by another expression", function() {
        var newX = x.add(y); // x + y
        var newY = y.add(x); // y + x

        answer = newX.multiply(newY); // (x + y) * (y + x) = x^2 + xy + xy + y^2 = x^2 + y^2 + 2xy
        expect(answer.print()).toEqual("x^2 + y^2 + 2xy");
    });

    it("should combine like terms correctly after multiplying by another expression", function() {
        var newX = x.add(3); // x + 3

        var newY = y.add(4); // y + 4
        newY = newY.add(newX);  // y + x + 7

        var answer = newX.multiply(newY); // (x + 3) * (y + x + 7) =
                                          // xy + x^2 + 7x + 3y + 3x + 21 =
                                          // x^2 + xy + 10x + 3y + 21

        expect(answer.print()).toEqual("x^2 + xy + 10x + 3y + 21");
    });

    it("should remove terms that cancel out", function() {
        var newX = x.add(y); // x + y
        var newY = x.subtract(y); // x - y

        var answer = newX.multiply(newY); // (x + y) * (x - y) =
                                          // x^2 - xy + xy - y^2 =
                                          // x^2 - y^2

        expect(answer.print()).toEqual("x^2 - y^2")
    });
});

describe("Expression division", function() {
    var x = new Expression("x");
    var y = new Expression("y");

    it("should allow dividing by a fraction", function() {
        var answer = x.divide(new Fraction(1, 3));

        expect(answer.print()).toEqual("3x");
    });

    it("should allow dividing by an integer", function() {
        var answer = x.divide(5);

        expect(answer.print()).toEqual("1/5x");
    });

    it("should not allow dividing by another expression", function() {
        expect(function(){x.divide(y)}).toThrow("InvalidArgument");
    });

    it("should throw an exception if dividing by zero", function() {
        expect(function(){x.divide(0)}).toThrow("DivideByZero");
    })
});

describe("Expression printing to string", function() {
    it("should put a negative sign on the first term if it's negative", function() {
        var x = new Expression("x");
        x = x.multiply(-1);
        x = x.add(3);

        expect(x.print()).toEqual("-x + 3");
    });

    it("should get the signs right", function() {
        var x = new Expression("x");
        var y = new Expression("y");
        var z = new Expression("z");

        x = x.add(y).subtract(z).add(5);

        expect(x.print()).toEqual("x + y - z + 5");
    });

    it("should omit the constant if it's 0", function() {
        var x = new Expression("x");
        x = x.add(3);
        x = x.subtract(3);

        expect(x.print()).toEqual("x");
    });

    it("should only print the constant if all the other terms have been canceled out", function() {
        var x = new Expression("x");
        var y = new Expression("y");

        var expr1 = x.add(y).subtract(3);   // x + y - 3
        var expr2 = x.add(y);               // x + y

        var answer = expr1.subtract(expr2); // x + y - 3 - (x + y) = -3

        expect(answer.print()).toEqual("-3");
    });
});

describe("Expression printing to tek", function() {
    it("should put a negative sign on the first term if it's negative", function() {
        var x = new Expression("x");
        x = x.multiply(-1);
        x = x.add(3);

        expect(x.tex()).toEqual("-x + 3");
    });

    it("should get the signs right", function() {
        var x = new Expression("x");
        var y = new Expression("y");
        var z = new Expression("z");

        x = x.add(y).subtract(z).add(5);

        expect(x.tex()).toEqual("x + y - z + 5");
    });

    it("should omit the constant if it's 0", function() {
        var x = new Expression("x");
        x = x.add(3);
        x = x.subtract(3);

        expect(x.tex()).toEqual("x");
    });

    it("should only print the constant if all the other terms have been canceled out", function() {
        var x = new Expression("x");
        var y = new Expression("y");

        var expr1 = x.add(y).subtract(3);   // x + y - 3
        var expr2 = x.add(y);               // x + y

        var answer = expr1.subtract(expr2); // x + y - 3 - (x + y) = -3

        expect(answer.tex()).toEqual("-3");
    });
});

describe("Expression evaluation with one variable - linear", function() {
    var x = new Expression("x");
    x = x.add(3);

    it("should allow evaluating at integers", function() {
        var answer = x.evaluateAt({'x': 2});

        expect(answer.print()).toEqual("5");
    });

    it("should allow evaluating at fractions", function() {
        var answer = x.evaluateAt({'x': new Fraction(1, 5)});

        expect(answer.print()).toEqual("16/5");
    });
});

describe("Expression evaluation with one variable - nonlinear", function() {
    var x = new Expression("x");
    var x2 = x.multiply(x).add(x).add(3); // x^2 + x + 3

    it("should allow evaluating at integers", function() {
        var answer = x2.evaluateAt({x: 2}); // 2^2 + 2 + 3 = 9

        expect(answer.print()).toEqual("9");
    });

    it("should allow evaluating at fractions", function() {
        var answer = x2.evaluateAt({x: new Fraction(1, 5)}); // (1/5)^2 + 1/5 + 3 = 81/25

        expect(answer.print()).toEqual("81/25");
    });
});

describe("Expression evaluation with multiple variables - linear", function() {
    var x = new Expression("x");
    var y = new Expression("y");
    var z = x.add(y); // x + y

    it("should return an expression when not substituting all the variables", function() {
        var answer = z.evaluateAt({x: 3});

        expect(answer.print()).toEqual("y + 3");
    });

    it("should return a fraction when substituting all the variables", function() {
        var answer = z.evaluateAt({x: 3, y: new Fraction(1, 2)});

        expect(answer.print()).toEqual("7/2");
    });

    it("should return a fraction when substituting variables out of order", function() {
        var answer = z.evaluateAt({y: new Fraction(1, 2), 'x': 3});

        expect(answer.print()).toEqual("7/2");
    });
});

describe("Expression evaluation with multiple variables - nonlinear", function() {
    var x = new Expression("x");
    var y = new Expression("y");

    it("should return an expression when not substituting all the variables", function() {
        var x1 = x.multiply(x).add(x).subtract(y); // x^2 + x - y

        var answer = x1.evaluateAt({x:3}); // 3^2 + 3 - y = -y + 12

        expect(answer.print()).toEqual("-y + 12");
    });

    it("should return a fraction when substituting all the variables", function() {
        var x1 = x.multiply(x).add(x).subtract(y); // x^2 + x - y

        var answer = x1.evaluateAt({x: 3, y: new Fraction(1, 2)}); // 3^2 + 3 - 1/2 = 23/2

        expect(answer.print()).toEqual("23/2");
    });

    it("should return a fraction when substituting variables out of order", function() {
        var x1 = x.multiply(x).add(x).subtract(y); // x^2 + x - y

        var answer = x1.evaluateAt({y: new Fraction(1, 2), x: 3});

        expect(answer.print()).toEqual("23/2");
    });
});

describe("Expression evaluation with multiple variables - crossproducts", function() {
    var x = new Expression("x");
    var y = new Expression("y");

    it("should return an expression when not substituting all the variables", function() {
        var x1 = x.multiply(x).multiply(y).add(x); // x^2y + x

        var answer = x1.evaluateAt({x:3}); // 3^2y + 3 = 9y + 3

        expect(answer.print()).toEqual("9y + 3");
    });

    it("should return a reduced fraction when substituting all the variables", function() {
        var x1 = x.multiply(x).multiply(y).add(x); // x^2y + x

        var answer = x1.evaluateAt({y: new Fraction(1, 2), x:3}); // 3^2 * (1/2) + 3 = 15/2

        expect(answer.print()).toEqual("15/2");
    });
});