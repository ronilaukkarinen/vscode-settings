package main

import (
	"fmt"
	"reflect"
	"os"
)

var (
	a = 100.0
)

func main() {
	a := 10.0000
	b := 3

	fmt.Println(
		"\nA is type", reflect.TypeOf(a),
		"and B is of type", reflect.TypeOf(b))

	c := int(a) + b

	fmt.Println("\nC has value:", c, "and is of type:", reflect.TypeOf(c))

	for _, env := range os.Environ() {
		fmt.Println(env)
	}
}
