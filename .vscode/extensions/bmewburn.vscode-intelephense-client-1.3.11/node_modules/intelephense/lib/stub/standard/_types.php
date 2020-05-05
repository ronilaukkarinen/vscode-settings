<?php

namespace {

   
    /**
     * Generator objects are returned from generators, cannot be instantiated via new.
     * @link https://secure.php.net/manual/en/class.generator.php
     * @link https://wiki.php.net/rfc/generators
     */
    final class Generator implements Iterator {
        /**
         * Throws an exception if the generator is currently after the first yield.
         * @return void
         */
        function rewind() {}
        /**
         * Returns false if the generator has been closed, true otherwise.
         * @return bool
         */
        function valid() {}
        /**
         * Returns whatever was passed to yield or null if nothing was passed or the generator is already closed.
         * @return mixed
         */
        function current() {}
        /**
         * Returns the yielded key or, if none was specified, an auto-incrementing key or null if the generator is already closed.
         * @return string|float|int|bool|null
         */
        function key() {}
        /**
         * Resumes the generator (unless the generator is already closed).
         * @return void
         */
        function next() {}

        /**
         * Sets the return value of the yield expression and resumes the generator (unless the generator is already closed).
         * @param mixed $value
         * @return mixed
         */
        function send($value) {}

        /**
         * Throws an exception at the current suspension point in the generator.
         * @param Throwable $exception
         * @return mixed
         */
        function throw(Throwable $exception) {}

        /**
         * Returns whatever was passed to return or null if nothing.
         * Throws an exception if the generator is still valid.
         * @link https://wiki.php.net/rfc/generator-return-expressions
         * @return mixed|null
         * @since 7.0
         */
        function getReturn() {}

        /**
         * Serialize callback
         * Throws an exception as generators can't be serialized.
         * @link https://php.net/manual/en/generator.wakeup.php
         * @return void
         */
        public function __wakeup(){}
    }

    class ClosedGeneratorException extends Exception {}

}

