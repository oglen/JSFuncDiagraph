/**
 * Created by Justin on 15-4-18.
 */

define([
    'underscore'
], function (_) {
    'use strict';

    var example = {};

    example.expressions = [
        ['x=4*cos(2*q)*cos(q);y=4*cos(2*q)*sin(q);q=[0,2*PI]', '06f'],
        ['x=q*cos(q);y=q*sin(q);q=[-2.5*PI,2.5*PI]', '0f6'],
        ['x=4*(sin(2*q)+0.2*sin(80*q))*cos(q);y=4*(sin(2*q)+0.2*sin(80*q))*sin(q);q=[0,2*PI]', 'f06'],
        ['x=4*cos(8*q)*cos(q);y=4*cos(8*q)*sin(q);q=[0,2*PI]', 'fc3'],
        ['x=q*cos(q);y=q*sin(q);q=[0,4*PI]', 'c60'],
        ['x=3*cos(3*q)*cos(q+2);y=3*cos(3*q)*sin(q+2);q=[0,2*PI]', '0c0'],
        ['x=2*(sin(q)-0.5*sin(2*q));y=2*sin(q);q=[0,2*PI]', '30c'],
        ['x=2*(cos(q)-0.5*cos(2*q));y=2*(sin(q)-0.5*sin(2*q));q=[0,2*PI]', 'cc0'],
        ['x=4*cos(16*q)*cos(q);y=4*cos(16*q)*sin(q);q=[0,2*PI];', 'f63'],
        ['y=cos(8*x)*log(x+1)', 'f93'],
        ['y=sin(x+1/x);', '933'],
        ['x=8*cos(7*q);y=8*sin(6*q);q=[0,4*PI];', '69f'],
        ['x=2*(1*cos(q)-cos(5*q));y=2*(2*sin(q)-sin(4*q));q=[0,4*PI];', '966'],
        ['x=4*sin(q);y=4*cos(q);q=[0,4*PI];', '9c3'],
        ['y=tan(x)', '0f3'],
        ['y=sin(20*x)*sin(x)', '90f'],
        ['y=pow(x,2)', '33f'],
        ['y=1/x+x;', 'f30']
    ];

    example.getRandomExp = function () {
        var exp = example.expressions[_.random(0, example.expressions.length - 1)];
        return [exp];
    };

    example.getAllExps = function () {
        return example.expressions;
    };

    return example;
});