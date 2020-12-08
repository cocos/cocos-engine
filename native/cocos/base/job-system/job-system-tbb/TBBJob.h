#pragma once

namespace cc {

class Job {
public:

    Job() noexcept {}
    ~Job() = default;
    Job(Job const&) = delete;
    Job(Job&&) = delete;
    Job& operator=(Job const&) = delete;
    Job& operator=(Job&&) = delete;

    virtual void precede(Job *other) noexcept = 0;

private:

};

} // namespace cc
